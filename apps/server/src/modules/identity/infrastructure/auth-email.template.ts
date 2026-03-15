const APP_NAME = "Articys";
const BRAND_ACCENT = "#0f766e";
const BRAND_ACCENT_DARK = "#134e4a";
const SURFACE = "#ffffff";
const PAGE = "#f3f7f6";
const BORDER = "#d7e2df";
const TEXT = "#16302b";
const MUTED = "#5d766f";
const CARD_SHADOW = "0 18px 48px rgba(15, 23, 42, 0.08)";

export interface AuthEmailTemplate {
	subject: string;
	html: string;
	text: string;
}

export function createAuthEmailTemplate(input: {
	title: string;
	subtitle: string;
	ctaLabel: string;
	ctaUrl: string;
	intro: string;
	helpText: string;
	safetyNote: string;
	textLines: string[];
}): AuthEmailTemplate {
	const safeTitle = escapeHtml(input.title);
	const safeSubtitle = escapeHtml(input.subtitle);
	const safeIntro = escapeHtml(input.intro);
	const safeHelpText = escapeHtml(input.helpText);
	const safeSafetyNote = escapeHtml(input.safetyNote);
	const safeCtaLabel = escapeHtml(input.ctaLabel);
	const safeCtaUrl = escapeHtml(input.ctaUrl);
	const safeTextLines = input.textLines.map((line) => escapeTextLine(line));

	return {
		subject: input.title,
		html: [
			"<!doctype html>",
			'<html lang="en">',
			"<head>",
			'<meta charset="utf-8" />',
			'<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
			`<title>${safeTitle}</title>`,
			"</head>",
			`<body style="margin:0;padding:0;background:${PAGE};font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:${TEXT};">`,
			'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f7f6;padding:32px 16px;">',
			"<tr>",
			'<td align="center">',
			`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${SURFACE};border:1px solid ${BORDER};border-radius:24px;overflow:hidden;box-shadow:${CARD_SHADOW};">`,
			"<tr>",
			`<td style="padding:28px 32px;background:linear-gradient(135deg, ${BRAND_ACCENT_DARK}, ${BRAND_ACCENT});color:#ffffff;">`,
			'<div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.84;">Articys Account</div>',
			`<h1 style="margin:14px 0 8px;font-size:30px;line-height:1.15;font-weight:700;">${safeTitle}</h1>`,
			`<p style="margin:0;font-size:15px;line-height:1.6;opacity:0.92;">${safeSubtitle}</p>`,
			"</td>",
			"</tr>",
			"<tr>",
			'<td style="padding:32px;">',
			`<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${TEXT};">${safeIntro}</p>`,
			`<div style="margin:28px 0;"><a href="${safeCtaUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:${BRAND_ACCENT};color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">${safeCtaLabel}</a></div>`,
			`<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:${MUTED};">${safeHelpText}</p>`,
			`<div style="margin:18px 0 0;padding:16px 18px;border-radius:16px;background:#f7fbfa;border:1px solid ${BORDER};">`,
			`<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:${MUTED};font-weight:600;">Button not working?</p>`,
			`<p style="margin:0;font-size:13px;line-height:1.7;word-break:break-word;"><a href="${safeCtaUrl}" style="color:${BRAND_ACCENT};text-decoration:underline;">${safeCtaUrl}</a></p>`,
			"</div>",
			`<p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:${MUTED};">${safeSafetyNote}</p>`,
			"</td>",
			"</tr>",
			"<tr>",
			`<td style="padding:20px 32px;border-top:1px solid ${BORDER};font-size:12px;line-height:1.7;color:${MUTED};">`,
			`Sent by ${APP_NAME}. This mailbox is for transactional account emails.`,
			"</td>",
			"</tr>",
			"</table>",
			"</td>",
			"</tr>",
			"</table>",
			"</body>",
			"</html>",
		].join(""),
		text: safeTextLines.join("\n"),
	};
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function escapeTextLine(value: string): string {
	return value.replaceAll("\r", "");
}
