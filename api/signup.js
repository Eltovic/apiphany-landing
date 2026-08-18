// POST /api/signup — captures lead email, notifies via Brevo
import { escapeHtml, truncate, isValidEmail, isRateLimited, getClientIp } from "./_lib/security.js";
import { getOrCreateLead, logInteraction } from "./_lib/crm.js";

const ALLOWED_SOURCES = new Set(["hero", "cta", "landing"]);

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

  try {
    // 1. Add to Brevo contact list (list ID 3 = Apithany leads; create it if it doesn't exist yet)
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [process.env.BREVO_LEADS_LIST_ID ? Number(process.env.BREVO_LEADS_LIST_ID) : 3],
        updateEnabled: true,
        attributes: { SOURCE: source },
      }),
    });

    // 2. Notify owner
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Apithany", email: "noreply@apithany.com" },
        to: [{ email: "eastwaresolutions@gmail.com" }],
        subject: `New Apithany lead [${source}]: ${truncate(email, 254)}`,
        htmlContent: `<p style="font-family:sans-serif">New lead from the <strong>${escapeHtml(source)}</strong> form:<br/><a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></p>`,
      }),
    });

    const leadId = await getOrCreateLead(email, "landing_form");
    await logInteraction(leadId, "landing_form", `Lead signup from the ${source} form (email-only, no message).`);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Signup handler error:", err);
    // Don't surface errors to the user — form should feel instant
    return res.status(200).json({ ok: true });
  }
}
