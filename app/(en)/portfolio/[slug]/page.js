import { notFound } from 'next/navigation';
import ProjectPageClient from '@/components/ProjectPageClient';
import { getAllLocations, getLocationBySlug, getLocationDetail, locationSlug } from '@/lib/projects';
import { locationMetadata, locationJsonLd } from '@/lib/locationSeo';

// Canonical location URL (owner decision). Unknown slugs return a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLocations().map((p) => ({ slug: locationSlug(p) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getLocationBySlug(slug);
  return project ? locationMetadata(project, 'en') : {};
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const project = getLocationBySlug(slug);
  if (!project) notFound();

  const detail = getLocationDetail(project);
  const jsonLd = locationJsonLd(project, 'en', detail.coverImage);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectPageClient project={detail} />
    </>
  );
}
