# Secure Submission Portal (Vercel)

A simple, responsive message and document submission website. It is a generic portal and is not affiliated with or designed to impersonate any government agency, organization, or existing email provider.

## What it does

- Collects name, email, organization, subject, and message.
- Accepts PDF, Word, Excel, PNG, JPG, and TXT attachments.
- Sends each submission to your inbox through the Resend email API.
- Does **not** ask for or collect passwords.
- Limits total attachments to 8 MB.

## Deploy to Vercel

1. Create a free account at [Vercel](https://vercel.com) if needed.
2. Create a Resend account at [Resend](https://resend.com).
3. In Resend, verify a domain you control and create an API key.
4. Upload this project to a GitHub repository, or use Vercel's **Add New → Project** flow to import the repository.
5. In Vercel, open **Project → Settings → Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | Your Resend API key |
   | `SUBMISSION_TO` | The inbox where you want submissions delivered |
   | `SUBMISSION_FROM` | A sender address on the domain you verified in Resend, e.g. `Submission Portal <portal@yourdomain.com>` |

6. Add the variables to Production (and Preview/Development if needed), save, then redeploy.
7. Open your deployed Vercel URL and send a test submission.

## Local development

Install the Vercel CLI, add the environment variables to a local `.env` file, then run:

```bash
npm install -g vercel
vercel dev
```

## Important notes

- Never put the Resend API key in `index.html`, `app.js`, or any browser-side code. It belongs only in Vercel environment variables.
- `SUBMISSION_FROM` must be an address/domain verified in your Resend account. The visitor's email is set as `Reply-To`.
- The 8 MB cap is an application-level total attachment limit. Keep uploads small to stay within your email provider's limits.
- This starter does not include persistent database storage, user accounts, or an admin dashboard. The email notification is the submission record.
- Add CAPTCHA/rate limiting and a retention policy before using this for a high-volume or sensitive workflow.
- Use only with an organization and domain you are authorized to represent. Do not request passwords, one-time codes, or payment credentials.
