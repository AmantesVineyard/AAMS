# America's Affordable Medical Lead Funnel

This project is a rapid lead-generation funnel for America's Affordable Medical to capture diabetic medical equipment inquiries.

## Features

- High-converting landing page with hero intake form
- Three-step qualification flow for detailed insurance verification
- Express backend endpoint that stores submissions to `data/leads.json`
- Responsive layout with modern design system

## Getting Started

```bash
cd /Users/ajw/Downloads/AAM
npm install
npm run dev
```

The development server runs on http://localhost:3000. Visit the root URL to view the landing page and proceed to `qualify.html` for the full funnel.

## Lead Capture

Lead submissions are persisted to `data/leads.json`. Each record captures contact details, insurance information, requested supply types, and timestamp metadata. Make sure the `data` directory remains writable wherever the app is deployed.

## Deployment Notes

- Set the `PORT` environment variable when deploying to hosting platforms.
- Consider wiring the `/api/leads` endpoint into a CRM, marketing automation tool, or secure database for production usage.
- Configure HTTPS and HIPAA-compliant storage before accepting real patient information in production.

# AAMS
