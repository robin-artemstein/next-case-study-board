// app/case-studies/[slug]/page.tsx
// This is a dynamic page for a single case study.
// It generates static pages for each case study at build time and can revalidate.

import { Metadata } from 'next';

export interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  cover: string;
  slug: string;
  content: string; // Assuming content is HTML string
}

// In Next.js 15, params is now a Promise that needs to be awaited
type Props = {
  params: Promise<{ slug: string }>;
};

// This function fetches data for a single case study based on its slug.
async function getCaseStudy(slug: string): Promise<CaseStudy> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
  }
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/case-studies/${slug}`, {
    next: { revalidate: 600 }, // Revalidate every 10 minutes
  });

  if (!res.ok) {
    // Provide more detailed error information
    throw new Error(`Failed to fetch case study: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// This function generates the metadata for the page dynamically.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params promise first
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  
  return {
    title: study.title + ' - Robin Chen',
    description: study.subtitle,
  };
}

// This function generates the static paths for all case studies at build time.
export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not defined during build');
    return [];
  }
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/case-studies/`);
    
    if (!res.ok) {
      console.error(`Failed to fetch case studies: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const caseStudies: CaseStudy[] = await res.json();
    
    return caseStudies.map((study) => ({
      slug: study.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// The page component now needs to await the params
export default async function CaseStudyDetailPage({ params }: Props) {
  // Await the params promise first
  const { slug } = await params;
  const study = await getCaseStudy(slug);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <article className="space-y-6">
        <div className='h-12'></div>
        <h1 className="text-4xl font-bold mb-8 text-amber-800">{study.title}</h1>
        <p className="text-xl text-gray-600">{study.subtitle}</p>
        <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: study.content }} />
        <br/>
      </article>
    </div>
  );
}
