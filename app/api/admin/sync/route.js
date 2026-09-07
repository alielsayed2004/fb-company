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
    const matches = dataUri.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUri;

    const mime = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = '.png';
    if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
    else if (mime.includes('webp')) ext = '.webp';
    else if (mime.includes('svg')) ext = '.svg';
    else if (mime.includes('mp4')) ext = '.mp4';
    else if (mime.includes('webm')) ext = '.webm';

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filename = `${baseFilename}${ext}`;
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

// GET: Fetch latest data directly from the filesystem
export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const projectsFile = path.join(dataDir, 'projects.json');
    let projects = [];

    if (fs.existsSync(projectsFile)) {
      try {
        projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      } catch (e) {}
    }

    // Also check for individual project files in data/projects/*.json
    const projectsSubDir = path.join(dataDir, 'projects');
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
            return saveBase64Media(item, projPublicDir, `gallery-${Date.now()}-${gIdx}`);
          }
          return item;
        });

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
      // Check status
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
