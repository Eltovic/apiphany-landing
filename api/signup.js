// POST /api/signup — captures lead email, notifies via Brevo
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email, source } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    // 1. Add to Brevo contact list (list ID 3 = Apiphany leads; create it if it doesn't exist yet)
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
        attributes: { SOURCE: source || "landing" },
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
        sender: { name: "Apiphany", email: "noreply@eastwaresolutions.com" },
        to: [{ email: "support@eastwaresolutions.com" }],
        subject: `New Apiphany lead [${source}]: ${email}`,
        htmlContent: `<p style="font-family:sans-serif">New lead from the <strong>${source}</strong> form:<br/><a href="mailto:${email}">${email}</a></p>`,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Signup handler error:", err);
    // Don't surface errors to the user — form should feel instant
    return res.status(200).json({ ok: true });
  }
}
