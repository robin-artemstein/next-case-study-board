# Error occurred prerendering page "/" when I try to build a Docker image for Next.js 15 App router project.

Hello, I'm a college student in CS and new to React and Next.js 15.

Now I'm working on a testing front end project, the tech stack combination for the project is Next.js 15 App router + Typescript.

I try to fetch the REST API data from remote server http://localhost:3001/api/v1/case-studies/ with incremental static regeneration (ISR) approach.

When I run a dev server with yarn run dev command, everything works normally without any issue.

But I try to build a Docker image, an error occurs, here is the error message.

```
[+] Building 23.5s (13/17)                                                                                                                                                                        docker:default
 => [internal] load build definition from Dockerfile                                                                                                                                                        0.0s
 => => transferring dockerfile: 1.05kB                                                                                                                                                                      0.0s
 => [internal] load metadata for docker.io/library/node:22-alpine                                                                                                                                           2.3s
 => [internal] load .dockerignore                                                                                                                                                                           0.0s
 => => transferring context: 81B                                                                                                                                                                            0.0s
 => [internal] load build context                                                                                                                                                                           0.3s
 => => transferring context: 22.37MB                                                                                                                                                                        0.2s
 => [builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9                                                                             0.0s
 => CACHED [runner 2/7] RUN apk add --no-cache dumb-init                                                                                                                                                    0.0s
 => CACHED [runner 3/7] WORKDIR /app                                                                                                                                                                        0.0s
 => CACHED [builder 2/7] RUN apk add --no-cache libc6-compat                                                                                                                                                0.0s
 => CACHED [builder 3/7] WORKDIR /app                                                                                                                                                                       0.0s
 => CACHED [builder 4/7] COPY package.json yarn.lock ./                                                                                                                                                     0.0s
 => CACHED [builder 5/7] RUN yarn install --frozen-lockfile                                                                                                                                                 0.0s
 => [builder 6/7] COPY . .                                                                                                                                                                                  0.3s
 => ERROR [builder 7/7] RUN yarn build                                                                                                                                                                     20.4s
------
 > [builder 7/7] RUN yarn build:
1.502 yarn run v1.22.22
1.568 $ next build --turbopack
5.217 Attention: Next.js now collects completely anonymous telemetry regarding usage.
5.218 This information is used to shape Next.js' roadmap and prioritize features.
5.218 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
5.218 https://nextjs.org/telemetry
5.218
5.320    ▲ Next.js 15.5.3 (Turbopack)
5.320    - Environments: .env
5.320
5.574    Creating an optimized production build ...
14.74  ✓ Finished writing to disk in 24ms
14.78  ✓ Compiled successfully in 16.3s
14.79    Linting and checking validity of types ...
18.17    Collecting page data ...
18.76 Error generating static params: TypeError: fetch failed
18.76     at async Object.e [as generateStaticParams] (.next/server/chunks/ssr/[root-of-the-server]__e817e153._.js:1:5892) {
18.76   [cause]: [AggregateError: ] { code: 'ECONNREFUSED' }
18.76 }
19.35    Generating static pages (0/5) ...
20.21    Generating static pages (1/5)
20.21    Generating static pages (2/5)
20.24 Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
20.24 TypeError: fetch failed
20.24     at async f (.next/server/chunks/ssr/[root-of-the-server]__d3394ff5._.js:1:13883)
20.24     at async g (.next/server/chunks/ssr/[root-of-the-server]__d3394ff5._.js:1:14059) {
20.24   digest: '3623707747',
20.24   [cause]: [AggregateError: ] { code: 'ECONNREFUSED' }
20.24 }
20.24 Export encountered an error on /page: /, exiting the build.
20.27  ⨯ Next.js build worker exited with code: 1 and signal: null
20.32 error Command failed with exit code 1.
20.32 info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
------
Dockerfile:20
--------------------
  18 |
  19 |     # Build Next.js app (creates .next folder)
  20 | >>> RUN yarn build
  21 |
  22 |
--------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c yarn build" did not complete successfully: exit code: 1
```

The files and directories structure for this project.

```
.
├── .dockerignore
├── .env
├── .gitignore
├── Dockerfile
├── README.md
├── app
│   ├── [slug]
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tree.txt
├── tsconfig.json
└── yarn.lock
```

The complete code of app/page.tsx:

```
// Case study boardlist page
// This page lists all results from remote server.
// It uses Incremental Static Regeneration (ISR) to fetch data every 600 seconds (10 minutes).

import Link from 'next/link';
import Image from 'next/image'
import { Metadata } from 'next';

export interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  cover: string;
  slug: string;
  content: string; // Assuming content is HTML string
}

export const metadata: Metadata = {
  title: 'Testing project...',
  description: 'A collection of my product design and UX development projects.',
};

// This function fetches the data from http://localhost:3001/api/v1/case-studies/
// The URL http://localhost:3001 is stored in the .env file.
// The `revalidate` option enables ISR.
async function getCaseStudies(): Promise<CaseStudy[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/case-studies/`, {
    next: { revalidate: 600 }, // Revalidate every 600 seconds (10 minutes)
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch case studies');
  }

  return res.json();
}

// This function component is UI rendering from fetched remote data.
export default async function Home() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="space-y-8">
      <div className='h-12'></div>
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Works</h1>
      <div className="flex flex-wrap">
        {caseStudies.map((study) => (
          <div className="w-[405px] p-2" key={study.id}>
            <Link href={`/${study.slug}`}>
              <div><Image src={study.cover} width={404} height={316} alt={study.title} /></div>
              <div className="text-2xl text-blue-100 font-semibold transition duration-500 ease-in-out hover:text-blue-300">{study.title}</div>
              <div className="ext-gray-600">{study.subtitle}</div>
            </Link>
          </div>
        ))}
      </div>
      <br/>
    </div>
  );
}
```

package.json:

```
{
  "name": "next-case-study-board",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  },
  "dependencies": {
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "next": "15.5.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}

```

next.config.ts:

```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {remotePatterns: [{protocol: "https", hostname: "*",}],  },
  output: 'standalone',
};

export default nextConfig;
```

Dockerfile.

```
# Stage 1: Build dependencies & Next.js
FROM node:22-alpine AS builder

# Install dependencies for native builds (sharp, etc.)
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files first (better cache for Docker)
COPY package.json yarn.lock ./

# Install all dependencies (including dev)
RUN yarn install --frozen-lockfile

# Copy project files
COPY . .

# Build Next.js app (creates .next folder)
RUN yarn build


# Stage 2: Production runtime
FROM node:22-alpine AS runner

# Install minimal tools
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy only production build output from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy .env file (consider using environment variables in production instead)
COPY .env .

# Expose default Next.js port
EXPOSE 3000

# Start Next.js with dumb-init (handles PID 1 correctly)
CMD ["dumb-init", "node", "server.js"]
```

.dockerignore.

```
node_modules
.next/cache
.git
Dockerfile
```
Any help appreciated, and let me know if I can provide more information.
