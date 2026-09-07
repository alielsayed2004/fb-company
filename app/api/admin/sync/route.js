import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Helper to save base64 data to physical file in public/
function saveBase64Media(dataUri, targetDir, baseFilename) {
  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) {
    return dataUri;
  }
  try {
    const commaIndex = dataUri.indexOf(',');
    if (commaIndex === -1) return dataUri;

    const meta = dataUri.substring(0, commaIndex);
    const base64Data = dataUri.substring(commaIndex + 1);
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = '.jpg';
    if (meta.includes('png')) ext = '.png';
    else if (meta.includes('webp')) ext = '.webp';
    else if (meta.includes('svg')) ext = '.svg';
    else if (meta.includes('mp4')) ext = '.mp4';
    else if (meta.includes('webm')) ext = '.webm';

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filename = `${baseFilename}-${Date.now()}${ext}`;
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicDir = path.join(process.cwd(), 'public');
    const relToPublic = path.relative(publicDir, filePath);
    return `/${relToPublic.replace(/\\/g, '/')}`;
  } catch (err) {
    console.error('Error saving base64 media:', err);
    return dataUri;
  }
}

// GET: Fetch latest data directly from the filesystem & auto-discover disk images
export async function GET() {
  try {
    const rootDir = process.cwd();
    const dataDir = path.join(rootDir, 'data');
    const projectsFile = path.join(dataDir, 'projects.json');
    const projectsSubDir = path.join(dataDir, 'projects');
    const publicProjectsDir = path.join(rootDir, 'public', 'projects');
    const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif']);

    let projects = [];

    if (fs.existsSync(projectsFile)) {
      try {
        projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      } catch (e) {}
    }

    // Also check for individual project files in data/projects/*.json
    if (fs.existsSync(projectsSubDir)) {
      const files = fs.readdirSync(projectsSubDir).filter(f => f.endsWith('.json'));
      const individualProjects = [];
      for (const f of files) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(projectsSubDir, f), 'utf8'));
          if (content && content.id) {
            individualProjects.push(content);
          }
        } catch (e) {}
      }
      if (individualProjects.length > 0) {
        const idMap = new Map();
        for (const p of projects) idMap.set(p.id, p);
        for (const p of individualProjects) {
          idMap.set(p.id, { ...(idMap.get(p.id) || {}), ...p });
        }
        projects = Array.from(idMap.values());
      }
    }

    // Auto-discover images and valid covers for every project folder
    projects = projects.map((p) => {
      const pDir = path.join(publicProjectsDir, p.id);
      if (!fs.existsSync(pDir)) return p;

      const diskFiles = fs.readdirSync(pDir, { withFileTypes: true })
        .filter(f => f.isFile() && imageExts.has(path.extname(f.name).toLowerCase()))
        .map(f => f.name);

      let coverImage = p.coverImage;
      const currentCoverPath = coverImage ? path.join(rootDir, 'public', coverImage.replace(/^\//, '')) : '';
      if (!coverImage || !fs.existsSync(currentCoverPath)) {
        if (diskFiles.includes('cover.png')) coverImage = `/projects/${p.id}/cover.png`;
        else if (diskFiles.includes('cover.jpg')) coverImage = `/projects/${p.id}/cover.jpg`;
        else if (diskFiles.includes('Artboard 3.jpg')) coverImage = `/projects/${p.id}/Artboard 3.jpg`;
        else if (diskFiles.includes('Artboard 4.jpg')) coverImage = `/projects/${p.id}/Artboard 4.jpg`;
        else if (diskFiles.length > 0) coverImage = `/projects/${p.id}/${diskFiles[0]}`;
      }

      // Merge and deduplicate gallery
      const existingGallery = Array.isArray(p.gallery) ? p.gallery : [];
      const diskGallery = diskFiles.map(f => `/projects/${p.id}/${f}`);
      const mergedGallery = Array.from(new Set([...existingGallery, ...diskGallery]));

      return {
        ...p,
        coverImage: coverImage || p.coverImage,
        gallery: mergedGallery
      };
    });

    let blogsEn = [];
    let blogsAr = [];
    const blogsFile = path.join(dataDir, 'blogs.json');
    if (fs.existsSync(blogsFile)) {
      try {
        const b = JSON.parse(fs.readFileSync(blogsFile, 'utf8'));
        blogsEn = b.en || [];
        blogsAr = b.ar || [];
      } catch (e) {}
    }

    let brands = [];
    const brandsFile = path.join(dataDir, 'brands.json');
    if (fs.existsSync(brandsFile)) {
      try {
        brands = JSON.parse(fs.readFileSync(brandsFile, 'utf8'));
      } catch (e) {}
    }

    let counters = null;
    let contactInfo = null;
    const companyFile = path.join(dataDir, 'company.json');
    if (fs.existsSync(companyFile)) {
      try {
        const comp = JSON.parse(fs.readFileSync(companyFile, 'utf8'));
        counters = comp.counters || null;
        contactInfo = comp.contactInfo || null;
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      projects,
      blogsEn,
      blogsAr,
      brands,
      counters,
      contactInfo
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Save all changes directly to project files on the machine & push to GitHub
export async function POST(req) {
  try {
    const body = await req.json();
    const { projects, blogsEn, blogsAr, brands, counters, contactInfo } = body;

    const rootDir = process.cwd();
    const dataDir = path.join(rootDir, 'data');
    const projectsSubDir = path.join(dataDir, 'projects');
    const publicProjectsDir = path.join(rootDir, 'public', 'projects');
    const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif']);

    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(projectsSubDir)) fs.mkdirSync(projectsSubDir, { recursive: true });
    if (!fs.existsSync(publicProjectsDir)) fs.mkdirSync(publicProjectsDir, { recursive: true });

    let cleanedProjects = [];

    // 1. Process and save each project
    if (Array.isArray(projects)) {
      cleanedProjects = projects.map((proj) => {
        const projId = proj.id || `project-${Date.now()}`;
        const projPublicDir = path.join(publicProjectsDir, projId);
        if (!fs.existsSync(projPublicDir)) {
          fs.mkdirSync(projPublicDir, { recursive: true });
        }

        // Save cover image if base64
        let coverImage = proj.coverImage;
        if (coverImage && coverImage.startsWith('data:')) {
          coverImage = saveBase64Media(coverImage, projPublicDir, 'cover');
        }

        // Save video if base64
        let video = proj.video;
        if (video && video.startsWith('data:')) {
          video = saveBase64Media(video, projPublicDir, 'video');
        }

        // Save gallery images if base64
        let gallery = Array.isArray(proj.gallery) ? proj.gallery : [];
        gallery = gallery.map((item, gIdx) => {
          if (typeof item === 'string' && item.startsWith('data:')) {
            return saveBase64Media(item, projPublicDir, `gallery-${gIdx}`);
          }
          return item;
        });

        // Also check if any existing physical images in folder should be maintained in gallery
        if (fs.existsSync(projPublicDir)) {
          const diskFiles = fs.readdirSync(projPublicDir, { withFileTypes: true })
            .filter(f => f.isFile() && imageExts.has(path.extname(f.name).toLowerCase()))
            .map(f => `/projects/${projId}/${f.name}`);
          gallery = Array.from(new Set([...gallery, ...diskFiles]));
        }

        const cleanedProject = {
          ...proj,
          id: projId,
          coverImage,
          video,
          gallery
        };

        // Write individual project file: data/projects/[id].json
        const singleProjectFile = path.join(projectsSubDir, `${projId}.json`);
        fs.writeFileSync(singleProjectFile, JSON.stringify(cleanedProject, null, 2), 'utf8');

        return cleanedProject;
      });

      // Write master projects file: data/projects.json
      const masterProjectsFile = path.join(dataDir, 'projects.json');
      fs.writeFileSync(masterProjectsFile, JSON.stringify(cleanedProjects, null, 2), 'utf8');

      // Delete any project files that were removed from the array
      const activeIds = new Set(cleanedProjects.map(p => `${p.id}.json`));
      if (fs.existsSync(projectsSubDir)) {
        const existingFiles = fs.readdirSync(projectsSubDir).filter(f => f.endsWith('.json'));
        for (const f of existingFiles) {
          if (!activeIds.has(f)) {
            try { fs.unlinkSync(path.join(projectsSubDir, f)); } catch (e) {}
          }
        }
      }
    }

    // 2. Save blogs to data/blogs.json
    if (blogsEn || blogsAr) {
      const blogsFile = path.join(dataDir, 'blogs.json');
      fs.writeFileSync(blogsFile, JSON.stringify({ en: blogsEn || [], ar: blogsAr || [] }, null, 2), 'utf8');
    }

    // 3. Save brands to data/brands.json
    if (Array.isArray(brands)) {
      const cleanedBrands = brands.map((b) => {
        let logoUrl = b.logoUrl;
        if (logoUrl && logoUrl.startsWith('data:')) {
          const logosPublicDir = path.join(rootDir, 'public', 'logos');
          logoUrl = saveBase64Media(logoUrl, logosPublicDir, `brand-${b.id || Date.now()}`);
        }
        return { ...b, logoUrl };
      });
      const brandsFile = path.join(dataDir, 'brands.json');
      fs.writeFileSync(brandsFile, JSON.stringify(cleanedBrands, null, 2), 'utf8');
    }

    // 4. Save company info (counters, contact) to data/company.json
    if (counters || contactInfo) {
      const companyFile = path.join(dataDir, 'company.json');
      fs.writeFileSync(companyFile, JSON.stringify({ counters, contactInfo }, null, 2), 'utf8');
    }

    // 5. Automatic Git Commit & Push
    let gitResult = { synced: false, message: 'Git not run' };
    try {
      const { stdout: statusOut } = await execPromise('git status --porcelain', { cwd: rootDir });
      if (statusOut && statusOut.trim().length > 0) {
        await execPromise('git add data/ public/projects/ public/logos/', { cwd: rootDir });
        const commitMsg = `Content sync: Update projects & assets from Admin Panel [${new Date().toISOString().slice(0, 19).replace('T', ' ')}]`;
        await execPromise(`git commit -m "${commitMsg}"`, { cwd: rootDir });
        await execPromise('git push origin main', { cwd: rootDir });
        gitResult = { synced: true, message: 'Successfully committed and pushed to GitHub main' };
      } else {
        gitResult = { synced: true, message: 'No new file changes detected to commit' };
      }
    } catch (gitErr) {
      console.warn('Git sync warning (local files still saved successfully):', gitErr.message);
      gitResult = { synced: false, message: gitErr.message };
    }

    return NextResponse.json({
      success: true,
      message: 'Changes saved directly to project files on machine and synced to GitHub!',
      git: gitResult,
      projects: cleanedProjects
    });
  } catch (err) {
    console.error('Save API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
