// POST /api/signup — captures lead email, confirms to the visitor, notifies owner via Brevo
import { escapeHtml, truncate, isValidEmail, isRateLimited, getClientIp } from "./_lib/security.js";
import { getOrCreateLead, logInteraction } from "./_lib/crm.js";

const ALLOWED_SOURCES = new Set(["hero", "cta", "landing"]);

// Each step runs independently and logs its own failure, so one failing
// call (e.g. Brevo down) no longer silently skips the CRM write after it.
// The visitor still always gets a fast 200 — the form should feel instant.
async function step(label, fn) {
  try {
    const res = await fn();
    if (res && typeof res.ok === "boolean" && !res.ok) {
      console.error(`[signup] ${label} failed: HTTP ${res.status} ${truncate(await res.text().catch(() => ""), 300)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[signup] ${label} failed:`, err);
    return false;
  }
}

// Mirrors platform_config.signups_open in the app (ath-saas-ui lib/signups.ts):
// 'false' means new accounts are paused and visitors go on a waitlist.
// Fails open, like the app does.
async function areSignupsOpen() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return true;
  try {
    const r = await fetch(`${url}/rest/v1/platform_config?key=eq.signups_open&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = await r.json();
    const value = Array.isArray(rows) && rows[0] ? String(rows[0].value) : "true";
    return value.trim().toLowerCase() !== "false";
  } catch (err) {
    console.error("[signup] signups_open read failed:", err);
    return true;
  }
}

function confirmationEmail(signupsOpen) {
  const footer = `<p>Questions? Just reply to this email.</p>
<p style="color:#888;font-size:12px;margin-top:28px;">— The Apithany team · Eastware Solutions</p>`;
  if (!signupsOpen) {
    return {
      subject: "You're on the Apithany waitlist",
      html: `<html><body style="font-family:Arial,sans-serif;font-size:15px;color:#333;line-height:1.6;max-width:560px;">
<h2 style="color:#1f3a2e;">You're on the list!</h2>
<p>Thanks for your interest in Apithany. We're not opening new accounts for a short while as we upgrade our content engine.</p>
<p>Your spot on the waitlist is saved, and we'll email you as soon as we reopen. Nothing has been charged.</p>
${footer}</body></html>`,
    };
  }
  return {
    subject: "Thanks for your interest in Apithany",
    html: `<html><body style="font-family:Arial,sans-serif;font-size:15px;color:#333;line-height:1.6;max-width:560px;">
<h2 style="color:#1f3a2e;">Thanks for reaching out!</h2>
<p>Apithany's AI agents find profitable niches, write SEO articles, add affiliate links and publish them to your site automatically.</p>
<p>You can create your account whenever you're ready:</p>
<p><a href="https://app.apithany.com/register" style="display:inline-block;padding:12px 28px;background:#1f3a2e;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Create your account →</a></p>
${footer}</body></html>`,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  if (isRateLimited(`signup:${getClientIp(req)}`, 10, 10 * 60 * 1000)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const raw = req.body || {};
  if (!isValidEmail(raw.email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const email  = raw.email;
  const source = ALLOWED_SOURCES.has(raw.source) ? raw.source : "landing";
  const brevoHeaders = { "api-key": (process.env.BREVO_API_KEY || "").trim(), "Content-Type": "application/json" };

  // 1. Add to Brevo contact list (list ID 3 = Apithany leads)
  await step("brevo contact", () => fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: brevoHeaders,
    body: JSON.stringify({
      email,
      listIds: [process.env.BREVO_LEADS_LIST_ID ? Number(process.env.BREVO_LEADS_LIST_ID) : 3],
      updateEnabled: true,
      attributes: { SOURCE: source },
    }),
  }));

  // 2. Confirmation to the visitor, so "check your inbox" is true
  const signupsOpen = await areSignupsOpen();
  const confirmation = confirmationEmail(signupsOpen);
  const emailSent = await step("visitor confirmation", () => fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: brevoHeaders,
    body: JSON.stringify({
      sender: { name: "Apithany", email: "noreply@apithany.com" },
      replyTo: { email: "support@apithany.com", name: "Apithany Support" },
      to: [{ email }],
      subject: confirmation.subject,
      htmlContent: confirmation.html,
    }),
  }));

  // 3. Notify owner
  await step("owner alert", () => fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: brevoHeaders,
    body: JSON.stringify({
      sender: { name: "Apithany", email: "noreply@apithany.com" },
      to: [{ email: "eastwaresolutions@gmail.com" }],
      subject: `New Apithany lead [${source}]: ${truncate(email, 254)}`,
      htmlContent: `<p style="font-family:sans-serif">New lead from the <strong>${escapeHtml(source)}</strong> form:<br/><a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a><br/>Signups ${signupsOpen ? "open" : "PAUSED (waitlist)"} · confirmation email ${emailSent ? "sent" : "NOT sent — check Vercel logs"}</p>`,
    }),
  }));

  // 4. CRM lead + interaction + triage
  let interactionId = null;
  await step("crm", async () => {
    const leadId = await getOrCreateLead(email, "landing_form");
    if (!leadId) throw new Error("getOrCreateLead returned no id");
    interactionId = await logInteraction(leadId, "landing_form", `Lead signup from the ${source} form (email-only, no message).`);
  });

  if (interactionId) {
    await step("crm triage", () => fetch("https://app.apithany.com/api/crm/triage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": process.env.INTERNAL_CRM_SECRET || "",
      },
      body: JSON.stringify({ interaction_id: interactionId }),
    }));
  }

  return res.status(200).json({ ok: true, emailSent, signupsOpen });
}
