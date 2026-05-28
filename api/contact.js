// POST /api/contact — sends enquiry email via Brevo transactional API
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { name, company, email, type, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const subject = `Apithany enquiry [${type || "general"}] from ${name}`;
  const html = `
    <h2 style="margin:0 0 16px;font-family:sans-serif">New Apithany enquiry</h2>
    <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap">Name</td><td><strong>${name}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Company</td><td>${company || "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Type</td><td>${type}</td></tr>
    </table>
    <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
    <p style="font-family:sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${message}</p>
  `;

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Apithany", email: "noreply@eastwaresolutions.com" },
        to: [{ email: "support@eastwaresolutions.com", name: "Apithany Support" }],
        replyTo: { email, name },
        subject,
        htmlContent: html,
      }),
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.text();
      console.error("Brevo error:", err);
      return res.status(500).json({ error: "Email delivery failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
