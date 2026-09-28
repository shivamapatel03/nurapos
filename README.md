# nurapos

Nuradesk Modern Point of Sale (POS) & Admin Management System.

Built with Next.js, React, TypeScript, and Google Material Icons.

## Vercel Deployment

The Next.js frontend deploys to Vercel from the repository root. Vercel should use the detected Next.js framework and the default build command:

```text
npm run build
```

Set this Vercel environment variable for production API calls:

```text
NEXT_PUBLIC_API_URL=https://your-backend-domain.example/api
```

The ASP.NET API in `Backend/` is not hosted by Vercel. Deploy it separately with PostgreSQL, configure its production connection string and JWT secrets through the hosting provider, and allow the Vercel domain in its CORS policy.

Before deploying, verify the frontend build locally with:

```text
npx next build
```
