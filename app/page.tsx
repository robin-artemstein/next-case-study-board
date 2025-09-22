// Case study boardlist page
// This page lists all results from remote server.
// It uses Incremental Static Regeneration (ISR) to fetch data every 10 minutes.

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
  title: 'Works - Robin Chen',
  description: 'A collection of my product design and UX development projects.',
};

// This function fetches the data for the case studies.
// The `revalidate` option enables ISR.
async function getCaseStudies(): Promise<CaseStudy[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/case-studies/`, {
    next: { revalidate: 600 }, // Revalidate every 10 minutes (600 seconds)
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch case studies');
  }

  return res.json();
}

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