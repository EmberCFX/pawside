import { siteUrl } from "@/lib/env";

const NAVY = "#011C35";
const MINT = "#36CEC1";
const SAND = "#6B635A";
const CANVAS = "#F4F0EA";

export function fromAddress() {
  const raw = (process.env.RESEND_FROM ?? "Pawside <hello@pawside.co>").trim();
  const bracket = raw.match(/<([^>]+)>/);
  const email = (bracket?.[1] ?? (raw.includes("@") ? raw.replace(/"/g, "") : "hello@pawside.co"))
    .trim()
    .toLowerCase();
  return `Pawside <${email}>`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function firstNameOf(name?: string | null) {
  return (name ?? "").trim().split(/\s+/).filter(Boolean)[0] || "there";
}

type EmailCta = { href: string; label: string };

export function customerEmailHtml({
  preheader,
  eyebrow,
  title,
  intro,
  details,
  note,
  cta,
}: {
  preheader?: string;
  eyebrow?: string;
  title: string;
  intro: string;
  details?: Array<[string, string]>;
  note?: string;
  cta?: EmailCta;
}) {
  const logo = `${siteUrl()}/brand/pawside-logo-on-dark.png`;
  const rows = (details ?? [])
    .filter(([, value]) => value.trim())
    .map(
      ([label, value], index) => `
        <tr>
          <td style="padding:${index === 0 ? "0" : "12px"} 0 0;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${SAND};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            ${escapeHtml(label)}
          </td>
        </tr>
        <tr>
          <td style="padding:4px 0 0;font-size:16px;line-height:1.45;color:${NAVY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            ${escapeHtml(value)}
          </td>
        </tr>`,
    )
    .join("");

  const detailsBlock = rows
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;padding:20px 22px;background:${CANVAS};border-radius:14px;">${rows}</table>`
    : "";

  const ctaBlock = cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
        <tr>
          <td style="border-radius:999px;background:${NAVY};">
            <a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:14px 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
              ${escapeHtml(cta.label)}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background:${NAVY};padding:32px 32px 28px;text-align:center;">
              <img src="${logo}" width="176" alt="Pawside Pet Services" style="display:block;margin:0 auto;border:0;width:176px;max-width:70%;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${NAVY};">
              ${
                eyebrow
                  ? `<p style="margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MINT};font-weight:600;">${escapeHtml(eyebrow)}</p>`
                  : ""
              }
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:650;">${escapeHtml(title)}</h1>
              <p style="margin:16px 0 0;font-size:16px;line-height:1.65;color:${NAVY};">
                ${escapeHtml(intro)}
              </p>
              ${detailsBlock}
              ${note ? `<p style="margin:20px 0 0;font-size:15px;line-height:1.65;color:${SAND};">${escapeHtml(note)}</p>` : ""}
              ${ctaBlock}
              <p style="margin:32px 0 0;font-size:15px;line-height:1.65;color:${NAVY};">
                With care,<br />
                <strong>Aliya</strong><br />
                <span style="color:${SAND};">Pawside Pet Services</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;line-height:1.6;color:${SAND};text-align:center;border-top:1px solid rgba(1,28,53,0.08);">
              Pioneer Valley · Easthampton, MA<br />
              <a href="tel:+14133233953" style="color:${NAVY};text-decoration:none;">(413) 323-3953</a>
              &nbsp;·&nbsp;
              <a href="mailto:hello@pawside.co" style="color:${NAVY};text-decoration:none;">hello@pawside.co</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
