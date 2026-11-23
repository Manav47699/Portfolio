---
title: Deploying a static Next.js site with cPanel
description: How to deploy a static Next.js site on any cPanel hosting provider, step by step.
date: 2025-11-20
number: 1
tags: [nextjs, deployment, cpanel]
---

Shared cPanel hosting is cheap and common in Nepal, and with a static export it serves a Next.js site perfectly well. This is the exact process I used.

### Get hosting and a domain

Register with a cPanel hosting provider (Prabhu Host, Babal Host, etc.), then register your domain.

### Open the File Manager

Click **Log in to cPanel**, then open **File Manager**.

### Check your package.json scripts

Make sure your `package.json` has these scripts:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start"
},
```

### Enable static export

Make your `next.config.js` look like this:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
};
export default nextConfig;
```

### Build the site

Open a terminal in your project root and run:

```bash
npm install
npm run build
```

> [!NOTE]
> This generates a new folder called `out` that contains the complete static website.

### Compress the output

Open a terminal **inside the `out` folder** and run:

```bash
tar -czvf out.tar.gz *
```

> [!NOTE]
> This creates a single compressed `out.tar.gz` file, which is much faster to upload than hundreds of small files.

### Upload to public_html

In the File Manager, go to `public_html` and upload `out.tar.gz`.

### Extract it

Right-click the uploaded file and extract it in place.

> [!SUCCESS]
> Visit your domain to confirm the deployment worked.
