import type { ContactValues } from "./contact-validation";

export const CONTACT_RECIPIENT = "Jyoti.kumari174315@gmail.com";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function template(title: string, content: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;padding:24px 12px;background:#f5f5f5;color:#202020;font-family:Arial,sans-serif"><table role="presentation" style="width:100%;max-width:600px;margin:auto;border-collapse:collapse;background:#ffffff"><tr><td style="padding:32px 24px;overflow-wrap:anywhere;word-break:break-word"><p style="font-size:12px;letter-spacing:2px">JYOTII BHARDWAJ</p><h1 style="font-size:26px;line-height:1.25">${title}</h1>${content}<p style="margin-top:32px;font-size:14px;line-height:1.6">Warm regards,<br>Jyotii Bhardwaj</p></td></tr></table></body></html>`;
}

export function createContactEmails(values: ContactValues, from: string) {
  const name = escapeHtml(values.name);
  return [
    {
      from, to: [CONTACT_RECIPIENT], reply_to: values.email,
      subject: `Portfolio enquiry from ${values.name}`,
      text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
      html: template("New portfolio enquiry", `<p style="line-height:1.6"><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${escapeHtml(values.email)}</p><p style="white-space:pre-wrap;line-height:1.7">${escapeHtml(values.message)}</p>`),
    },
    {
      from, to: [values.email], reply_to: CONTACT_RECIPIENT,
      subject: "Thank you for getting in touch!",
      text: `Hi ${values.name},\n\nThank you for reaching out! Your message has been received. I'll review it and get back to you as soon as I can.\n\nIf you have anything else to add, simply reply to this email.\n\nWarm regards,\nJyotii Bhardwaj`,
      html: template("Thank you for reaching out!", `<p style="line-height:1.7">Hi ${name},</p><p style="line-height:1.7">Thank you for getting in touch! Your message has been received. I'll review it and get back to you as soon as I can.</p><p style="line-height:1.7">If you have anything else to add, simply reply to this email.</p>`),
    },
  ];
}
