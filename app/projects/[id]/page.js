import ProjectPageClient from './ProjectPageClient';
import projectsData from '@/data/projects.json';

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.id === resolvedParams.id);
  return <ProjectPageClient project={project} />;
}
