import fs from 'fs';
import path from 'path';
import ProjectPageClient from './ProjectPageClient';
import projectsData from '@/data/projects.json';

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id,
  }));
}

// Helper to auto-discover all images in public/projects/[id]/
function getDiscoveredImages(projectId) {
  try {
    const projectDir = path.join(process.cwd(), 'public', 'projects', projectId);
    if (!fs.existsSync(projectDir)) return [];

    const entries = fs.readdirSync(projectDir, { withFileTypes: true });
    const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif']);
    const images = [];

    // First check if images.json specifies exact files
    const imagesJsonPath = path.join(projectDir, 'images.json');
    if (fs.existsSync(imagesJsonPath)) {
      try {
        const raw = fs.readFileSync(imagesJsonPath, 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const item of list) {
            const formatted = item.startsWith('/') ? item : `/projects/${projectId}/${item}`;
            images.push(formatted);
          }
        }
      } catch (e) {
        // ignore parse error
      }
    }

    // Auto-discover all image files directly in the directory
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (imageExts.has(ext)) {
          const formatted = `/projects/${projectId}/${entry.name}`;
          if (!images.includes(formatted)) {
            images.push(formatted);
          }
        }
      }
    }

    return images;
  } catch (err) {
    console.warn(`Could not read images for ${projectId}:`, err.message);
    return [];
  }
}

// Helper to read individual project JSON if present in data/projects/[id].json
function getIndividualProjectData(projectId) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects', `${projectId}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    // fallback
  }
  return null;
}

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const baseProject = projectsData.find((p) => p.id === resolvedParams.id);

  if (!baseProject) {
    return <ProjectPageClient project={null} />;
  }

  // Check individual JSON file override
  const individualData = getIndividualProjectData(resolvedParams.id);
  const currentProject = { ...baseProject, ...(individualData || {}) };

  // Auto-discover images in folder
  const discoveredImages = getDiscoveredImages(resolvedParams.id);

  // Combine predefined gallery and discovered images (deduplicated)
  const mergedGallery = Array.from(new Set([
    ...(currentProject.gallery || []),
    ...discoveredImages
  ]));

  const finalProject = {
    ...currentProject,
    gallery: mergedGallery
  };

  return <ProjectPageClient project={finalProject} />;
}
