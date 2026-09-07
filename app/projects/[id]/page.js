import fs from 'fs';
import path from 'path';
import ProjectPageClient from './ProjectPageClient';
import projectsData from '@/data/projects.json';

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id,
  }));
}

// Helper to read PNG dimensions quickly from header
function getPngDimensions(filePath) {
  try {
    const buf = Buffer.alloc(24);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    if (buf.toString('ascii', 1, 4) === 'PNG') {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      if (width > 0 && height > 0) {
        return { width, height, ratio: Number((width / height).toFixed(2)) };
      }
    }
  } catch (e) {}
  return null;
}

// Helper to auto-discover brand logos in public/projects/[id]/logos/ or public/projects/[id]/brands/
function getDiscoveredBrandLogos(projectId) {
  try {
    const candidates = [
      path.join(process.cwd(), 'public', 'projects', projectId, 'logos'),
      path.join(process.cwd(), 'public', 'projects', projectId, 'brands'),
    ];
    const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif']);
    const discovered = [];

    for (const dir of candidates) {
      if (fs.existsSync(dir)) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (imageExts.has(ext)) {
              const rawName = path.basename(entry.name, path.extname(entry.name));
              const cleanName = rawName.replace(/[-_]/g, ' ').trim();
              const subDir = dir.endsWith('brands') ? 'brands' : 'logos';
              const fullPath = path.join(dir, entry.name);
              const dims = ext === '.png' ? getPngDimensions(fullPath) : null;
              discovered.push({
                name: cleanName,
                logo: `/projects/${projectId}/${subDir}/${entry.name}`,
                ratio: dims ? dims.ratio : 1.2
              });
            }
          }
        }
      }
    }
    return discovered;
  } catch (err) {
    console.warn(`Could not read brand logos for ${projectId}:`, err.message);
    return [];
  }
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

  // Auto-discover brand logos in folder
  const discoveredBrandLogos = getDiscoveredBrandLogos(resolvedParams.id);

  // Combine predefined gallery and discovered images (deduplicated)
  const mergedGallery = Array.from(new Set([
    ...(currentProject.gallery || []),
    ...discoveredImages
  ]));

  // Combine predefined brands with discovered brand logos
  const existingBrands = currentProject.brands || [];
  const mergedBrands = discoveredBrandLogos.length > 0
    ? [
        ...discoveredBrandLogos,
        ...existingBrands.filter(b => {
          const bName = typeof b === 'object' ? (b.name || '') : String(b || '');
          return !discoveredBrandLogos.some(d => d.name.toLowerCase() === bName.toLowerCase());
        })
      ]
    : existingBrands;

  const finalProject = {
    ...currentProject,
    brands: mergedBrands,
    gallery: mergedGallery
  };

  return <ProjectPageClient project={finalProject} />;
}
