const BRAND = "#7c3aed";

function layout(heading: string, bodyHtml: string, footerHtml: string): string {
    return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f5f3ff;font-family:Arial,Helvetica,sans-serif;color:#1e1b4b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;">
    <tr><td style="padding:32px;">
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">${heading}</h1>
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:0 32px 32px;font-size:12px;line-height:1.5;color:#6b7280;">${footerHtml}</td></tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
    return `<p style="margin:24px 0;"><a href="${href}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:999px;">${label}</a></p>
      <p style="margin:0 0 16px;font-size:13px;color:#6b7280;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${href}" style="color:${BRAND};word-break:break-all;">${href}</a></p>`;
}

export interface BuiltEmail {
    subject: string;
    html: string;
    text: string;
    headers?: Record<string, string>;
}

export function confirmationEmail(confirmUrl: string): BuiltEmail {
    return {
        subject: "Please confirm your subscription to the UnLtd newsletter",
        html: layout(
            "Confirm your subscription",
            `<p style="margin:0 0 8px;line-height:1.6;">Thanks for signing up to the UnLtd newsletter. Please confirm your email address to start receiving updates.</p>
      ${button(confirmUrl, "Confirm subscription")}
      <p style="margin:0;font-size:13px;color:#6b7280;">This link expires in 24 hours.</p>`,
            "If you didn't sign up, you can safely ignore this email and you won't be subscribed.",
        ),
        text: `Thanks for signing up to the UnLtd newsletter. Please confirm your email address:\n\n${confirmUrl}\n\nThis link expires in 24 hours. If you didn't sign up, you can safely ignore this email and you won't be subscribed.`,
    };
}

export function welcomeEmail(origin: string): BuiltEmail {
    const unsubscribeUrl = `${origin}/newsletter/unsubscribe`;
    return {
        subject: "Welcome to the UnLtd newsletter",
        html: layout(
            "You're subscribed",
            `<p style="margin:0 0 16px;line-height:1.6;">Thank you for confirming your email address. You'll now receive the UnLtd newsletter with news about our awards, events and the social entrepreneurs we support.</p>
      <p style="margin:0;line-height:1.6;">In the meantime, find out more at <a href="${origin}" style="color:${BRAND};">unltd.org.uk</a>.</p>`,
            `You can <a href="${unsubscribeUrl}" style="color:${BRAND};">unsubscribe</a> at any time.`,
        ),
        text: `Thank you for confirming your email address. You'll now receive the UnLtd newsletter with news about our awards, events and the social entrepreneurs we support.\n\nFind out more at ${origin}\n\nUnsubscribe at any time: ${unsubscribeUrl}`,
        headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
    };
}

export function unsubscribeVerificationEmail(unsubscribeUrl: string): BuiltEmail {
    return {
        subject: "Confirm you want to unsubscribe from the UnLtd newsletter",
        html: layout(
            "Unsubscribe from the newsletter",
            `<p style="margin:0 0 8px;line-height:1.6;">We received a request to unsubscribe this email address from the UnLtd newsletter. Use the button below to confirm.</p>
      ${button(unsubscribeUrl, "Unsubscribe")}
      <p style="margin:0;font-size:13px;color:#6b7280;">This link expires in 1 hour.</p>`,
            "If you didn't request this, you can safely ignore this email and you'll stay subscribed.",
        ),
        text: `We received a request to unsubscribe this email address from the UnLtd newsletter. Confirm here:\n\n${unsubscribeUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email and you'll stay subscribed.`,
    };
}
