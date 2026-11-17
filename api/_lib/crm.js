// Best-effort writes to the Apithany CRM (crm_leads/crm_interactions) in the
// ai_treasure_hunters Supabase project. Never throws — a CRM logging
// failure must never break the actual contact/signup form for the visitor.
// See docs/superpowers/specs/2026-08-11-apithany-crm-design.md (in the
// ai_treasure_hunters repo) for the full design.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export async function getOrCreateLead(email, source, name) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("[crm] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not configured — skipping CRM write");
    return null;
  }
  try {
    const lookupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_leads?email=ilike.${encodeURIComponent(email)}&select=id&limit=1`,
      { headers: headers() }
    );
    const existing = await lookupRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      return existing[0].id;
    }

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_leads`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, source, stage: "inquiry", ...(name ? { name } : {}) }),
    });
    const created = await insertRes.json();
    return Array.isArray(created) && created.length > 0 ? created[0].id : null;
  } catch (err) {
    console.error("[crm] getOrCreateLead failed:", err);
    return null;
  }
}

export async function logInteraction(leadId, channel, body, subject) {
  if (!leadId || !SUPABASE_URL || !SERVICE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_interactions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        lead_id: leadId,
        channel,
        direction: "inbound",
        body,
        status: "received",
        ...(subject ? { subject } : {}),
      }),
    });
    const created = await res.json();
    return Array.isArray(created) && created.length > 0 ? created[0].id : null;
  } catch (err) {
    console.error("[crm] logInteraction failed:", err);
    return null;
  }
}

// True when this lead already has an interaction on `channel` within the last
// `minutes` (optionally only those whose body starts with `bodyPrefix`) — used to drop duplicate form submissions (double clicks, retries)
// before any email is sent. Fails open (returns false) so a lookup error never
// blocks a genuine signup.
export async function hasRecentInteraction(leadId, channel, minutes = 10, bodyPrefix) {
  if (!leadId || !SUPABASE_URL || !SERVICE_KEY) return false;
  try {
    const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_interactions?lead_id=eq.${encodeURIComponent(leadId)}` +
        `&channel=eq.${encodeURIComponent(channel)}&created_at=gte.${encodeURIComponent(since)}` +
        (bodyPrefix ? `&body=like.${encodeURIComponent(bodyPrefix + "*")}` : "") +
        `&select=id&limit=1`,
      { headers: headers() }
    );
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch (err) {
    console.error("[crm] hasRecentInteraction failed:", err);
    return false;
  }
}
