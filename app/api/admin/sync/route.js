import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { commitFilesToGitHub, verifyGitHubToken, resolveToken } from '@/lib/githubSync';
import { isAdminRequest } from '@/lib/auth';

const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)?$/;


// Check if running in a writable filesystem (false on Vercel serverless)
function checkIsFsWritable() {
  try {
    const testFile = path.join(process.cwd(), '.write-test-' + Date.now());
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return true;
  } catch (e) {
    return false;
  }
}

// Extract base64 payload and extension
function parseBase64Data(dataUri) {
  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) {
    return null;
  }
  const commaIndex = dataUri.indexOf(',');
  if (commaIndex === -1) return null;

  const meta = dataUri.substring(0, commaIndex);
  const base64Data = dataUri.substring(commaIndex + 1);

  let ext = '.jpg';
  if (meta.includes('png')) ext = '.png';
  else if (meta.includes('webp')) ext = '.webp';
  else if (meta.includes('svg')) ext = '.svg';
  else if (meta.includes('mp4')) ext = '.mp4';
  else if (meta.includes('webm')) ext = '.webm';

  return { ext, base64Data };
}

// Save base64 to local disk if writable
function saveBase64MediaLocal(dataUri, targetDir, exactFilename) {
  if (exactFilename && !SAFE_FILENAME_REGEX.test(exactFilename)) {
    throw new Error(`Invalid filename format: ${exactFilename}`);
  }

  const parsed = parseBase64Data(dataUri);
  if (!parsed) return dataUri;

  try {
    const buffer = Buffer.from(parsed.base64Data, 'base64');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filename = exactFilename || `file-${Date.now()}${parsed.ext}`;
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicDir = path.join(process.cwd(), 'public');
    const relToPublic = path.relative(publicDir, filePath);
    return `/${relToPublic.replace(/\\/g, '/')}`;
  } catch (err) {
    console.error('Error saving base64 to disk:', err);
    return dataUri;
  }
}

// GET: Fetch latest data safely without resurrecting deleted items
export async function GET(req) {
  // 1. Strict server-side auth check
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // Cloud-sync status: checks the server-side GITHUB_TOKEN only (never a browser-supplied token)
    if (action === 'verify-token') {
      const result = await verifyGitHubToken(resolveToken());
      return NextResponse.json({ valid: result.valid, repoName: result.repoName, canPush: result.canPush, message: result.message });
    }

    const rootDir = process.cwd();
    const dataDir = path.join(rootDir, 'data');
    const projectsFile = path.join(dataDir, 'projects.json');
    const publicProjectsDir = path.join(rootDir, 'public', 'projects');
    const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif']);

    let projects = [];

    // Master source of truth: projects.json
    if (fs.existsSync(projectsFile)) {
      try {
        projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      } catch (e) {}
    }

    // Enrich covers only if cover is missing or broken
    projects = projects.map((p) => {
      if (!p.id || !SAFE_ID_REGEX.test(String(p.id))) {
        return p;
      }

      const pDir = path.join(publicProjectsDir, p.id);
      const hasDir = fs.existsSync(pDir);

      let coverImage = p.coverImage;
      if (hasDir) {
        const coverExists = coverImage && fs.existsSync(path.join(process.cwd(), 'public', coverImage));
        if (!coverExists) {
          const diskFiles = fs.readdirSync(pDir, { withFileTypes: true })
            .filter(f => f.isFile() && imageExts.has(path.extname(f.name).toLowerCase()))
            .map(f => f.name);

          if (diskFiles.includes('cover.jpg')) coverImage = `/projects/${p.id}/cover.jpg`;
          else if (diskFiles.includes('cover.png')) coverImage = `/projects/${p.id}/cover.png`;
          else if (diskFiles.includes('Artboard 3.jpg')) coverImage = `/projects/${p.id}/Artboard 3.jpg`;
          else if (diskFiles.includes('Artboard 4.jpg')) coverImage = `/projects/${p.id}/Artboard 4.jpg`;
          else if (diskFiles.length > 0) coverImage = `/projects/${p.id}/${diskFiles[0]}`;
        }
      }

      let video = p.video;
      if (hasDir) {
        const videoExists = video && fs.existsSync(path.join(process.cwd(), 'public', video));
        if (!videoExists) {
          if (fs.existsSync(path.join(pDir, 'video.mp4'))) {
            video = `/projects/${p.id}/video.mp4`;
          }
        }
      }

      // Respect user's gallery array as-is. If gallery is null/undefined, only then initialize from disk.
      let gallery = p.gallery;
      if (!Array.isArray(gallery) && hasDir) {
        const diskFiles = fs.readdirSync(pDir, { withFileTypes: true })
          .filter(f => f.isFile() && imageExts.has(path.extname(f.name).toLowerCase()))
          .map(f => `/projects/${p.id}/${f.name}`);
        gallery = diskFiles;
      }

      return {
        ...p,
        video: video || p.video || '',
        coverImage: coverImage || p.coverImage || '',
        gallery: Array.isArray(gallery) ? gallery : []
      };
    });

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
      brands,
      counters,
      contactInfo
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message, error: err.message }, { status: 500 });
  }
}

// POST: Save all changes directly (Local Filesystem on dev + GitHub Database API on cloud/Vercel)
export async function POST(req) {
  // 1. Strict server-side auth check
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const { projects, brands, counters, contactInfo } = body;

    // Sanitize client-supplied IDs with strict regex whitelist before path construction
    if (Array.isArray(projects)) {
      for (const proj of projects) {
        if (proj.id && !SAFE_ID_REGEX.test(String(proj.id))) {
          return NextResponse.json(
            { success: false, error: `Invalid project ID: ${proj.id}. ID must match ^[a-zA-Z0-9_-]+$` },
            { status: 400 }
          );
        }
      }
    }

    if (Array.isArray(brands)) {
      for (const brand of brands) {
        if (brand.id && !SAFE_ID_REGEX.test(String(brand.id))) {
          return NextResponse.json(
            { success: false, error: `Invalid brand ID: ${brand.id}. ID must match ^[a-zA-Z0-9_-]+$` },
            { status: 400 }
          );
        }
      }
    }

    // GitHub token comes from the server environment only
    const githubToken = resolveToken();

    const isFsWritable = checkIsFsWritable();
    const rootDir = process.cwd();
    const dataDir = path.join(rootDir, 'data');
    const publicProjectsDir = path.join(rootDir, 'public', 'projects');
    const logosPublicDir = path.join(rootDir, 'public', 'logos');

    const filesForGitHub = [];
    const deletedFilesForGitHub = [];

    // 1. Clean and process Projects
    let cleanedProjects = [];
    if (Array.isArray(projects)) {
      cleanedProjects = projects.map((proj, pIdx) => {
        const rawProjId = proj.id ? String(proj.id) : `project-${Date.now()}-${pIdx}`;
        if (!SAFE_ID_REGEX.test(rawProjId)) {
          throw new Error(`Invalid project ID: ${rawProjId}`);
        }
        const projId = rawProjId;
        const projPublicDir = path.join(publicProjectsDir, projId);

        // Process cover image
        let coverImage = proj.coverImage;
        if (coverImage && coverImage.startsWith('data:')) {
          const parsed = parseBase64Data(coverImage);
          if (parsed) {
            const fileName = `cover-${Date.now()}${parsed.ext}`;
            const publicPath = `/projects/${projId}/${fileName}`;
            filesForGitHub.push({
              path: `public/projects/${projId}/${fileName}`,
              content: parsed.base64Data,
              encoding: 'base64'
            });
            if (isFsWritable) {
              saveBase64MediaLocal(coverImage, projPublicDir, fileName);
            }
            coverImage = publicPath;
          }
        }

        // Process video if base64
        let video = proj.video;
        if (video && video.startsWith('data:')) {
          const parsed = parseBase64Data(video);
          if (parsed) {
            const fileName = `video-${Date.now()}${parsed.ext}`;
            const publicPath = `/projects/${projId}/${fileName}`;
            filesForGitHub.push({
              path: `public/projects/${projId}/${fileName}`,
              content: parsed.base64Data,
              encoding: 'base64'
            });
            if (isFsWritable) {
              saveBase64MediaLocal(video, projPublicDir, fileName);
            }
            video = publicPath;
          }
        }

        // Process gallery images - strictly respect what the user kept!
        let gallery = Array.isArray(proj.gallery) ? proj.gallery : [];
        gallery = gallery.map((item, gIdx) => {
          if (typeof item === 'string' && item.startsWith('data:')) {
            const parsed = parseBase64Data(item);
            if (parsed) {
              const fileName = `gallery-${Date.now()}-${gIdx}${parsed.ext}`;
              const publicPath = `/projects/${projId}/${fileName}`;
              filesForGitHub.push({
                path: `public/projects/${projId}/${fileName}`,
                content: parsed.base64Data,
                encoding: 'base64'
              });
              if (isFsWritable) {
                saveBase64MediaLocal(item, projPublicDir, fileName);
              }
              return publicPath;
            }
          }
          return item;
        });

        const cleaned = {
          ...proj,
          id: projId,
          coverImage,
          video,
          gallery
        };

        return cleaned;
      });

      // Master projects.json
      filesForGitHub.push({
        path: 'data/projects.json',
        content: JSON.stringify(cleanedProjects, null, 2)
      });

      if (isFsWritable) {
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        const masterProjectsFile = path.join(dataDir, 'projects.json');
        fs.writeFileSync(masterProjectsFile, JSON.stringify(cleanedProjects, null, 2), 'utf8');

        // Delete removed project directories and assets locally and on GitHub
        const activeProjIds = new Set(cleanedProjects.map(p => p.id));
        if (fs.existsSync(publicProjectsDir)) {
          const existingDirs = fs.readdirSync(publicProjectsDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);
          for (const dirName of existingDirs) {
            if (!activeProjIds.has(dirName)) {
              const fullDir = path.join(publicProjectsDir, dirName);
              try {
                const innerFiles = fs.readdirSync(fullDir);
                for (const ifile of innerFiles) {
                  deletedFilesForGitHub.push(`public/projects/${dirName}/${ifile}`);
                }
                if (isFsWritable) {
                  fs.rmSync(fullDir, { recursive: true, force: true });
                }
              } catch (e) {}
            }
          }
        }
      }
    }

    // 3. Brands
    let cleanedBrands = Array.isArray(brands) ? brands : [];
    cleanedBrands = cleanedBrands.map((b, bIdx) => {
      let logoUrl = b.logoUrl;
      const rawBrandId = b.id ? String(b.id) : `brand-${Date.now()}-${bIdx}`;
      if (!SAFE_ID_REGEX.test(rawBrandId)) {
        throw new Error(`Invalid brand ID: ${rawBrandId}`);
      }
      const brandId = rawBrandId;

      if (logoUrl && logoUrl.startsWith('data:')) {
        const parsed = parseBase64Data(logoUrl);
        if (parsed) {
          const fileName = `brand-${brandId}${parsed.ext}`;
          const publicPath = `/logos/${fileName}`;
          filesForGitHub.push({
            path: `public/logos/${fileName}`,
            content: parsed.base64Data,
            encoding: 'base64'
          });
          if (isFsWritable) {
            saveBase64MediaLocal(logoUrl, logosPublicDir, fileName);
          }
          logoUrl = publicPath;
        }
      }
      return { ...b, id: brandId, logoUrl };
    });

    const brandsContent = JSON.stringify(cleanedBrands, null, 2);
    filesForGitHub.push({
      path: 'data/brands.json',
      content: brandsContent
    });
    if (isFsWritable) {
      fs.writeFileSync(path.join(dataDir, 'brands.json'), brandsContent, 'utf8');
    }

    // 4. Company Info
    if (counters || contactInfo) {
      // Keep any other keys in company.json (e.g. countersMeta: verification status / source).
      let existingCompany = {};
      try {
        existingCompany = JSON.parse(fs.readFileSync(path.join(dataDir, 'company.json'), 'utf8'));
      } catch (e) {}
      const companyContent = JSON.stringify({
        ...existingCompany,
        ...(counters ? { counters } : {}),
        ...(contactInfo ? { contactInfo } : {}),
      }, null, 2) + '\n';
      filesForGitHub.push({
        path: 'data/company.json',
        content: companyContent
      });
      if (isFsWritable) {
        fs.writeFileSync(path.join(dataDir, 'company.json'), companyContent, 'utf8');
      }
    }

    // 5. Execution Strategy:
    // Strategy A: If GitHub Token is provided -> Commit directly to GitHub API
    if (githubToken) {
      try {
        const commitMsg = `Content sync: Admin updates [${new Date().toISOString().slice(0, 19).replace('T', ' ')}]`;
        const gitResult = await commitFilesToGitHub({
          token: githubToken,
          files: filesForGitHub,
          deletedPaths: deletedFilesForGitHub,
          commitMessage: commitMsg
        });

        return NextResponse.json({
          success: true,
          message: 'تم حفظ ونشر جميع التعديلات مباشرة في GitHub عبر الـ Cloud API! (سيعيد Vercel البناء خلال ثوانٍ)',
          mode: 'cloud-github-api',
          commitSha: gitResult.commitSha,
          commitUrl: gitResult.commitUrl,
          projects: cleanedProjects,
          brands: cleanedBrands
        });
      } catch (apiErr) {
        console.error('GitHub API Commit failed:', apiErr);
        const isBadCreds = apiErr.message && (apiErr.message.includes('401') || apiErr.message.includes('Bad credentials'));
        if (isFsWritable) {
          return NextResponse.json({
            success: true,
            warning: false,
            message: 'تم حفظ جميع التعديلات في ملفات المشروع بنجاح! ✅',
            mode: 'local-disk',
            projects: cleanedProjects,
            brands: cleanedBrands
          });
        }
        return NextResponse.json({
          success: false,
          error: apiErr.message,
          message: isBadCreds
            ? 'رمز GITHUB_TOKEN في إعدادات Vercel منتهي الصلاحية أو غير صالح (Bad credentials). يرجى تحديثه من لوحة Vercel.'
            : `فشل الحفظ عبر GitHub API: ${apiErr.message}`
        }, { status: 500 });
      }
    }

    // Strategy B: No GitHub Token, but local filesystem is writable (Local Development Machine)
    if (isFsWritable) {
      return NextResponse.json({
        success: true,
        message: 'تم حفظ جميع التعديلات في ملفات المشروع محلياً ✅ (ارفعها إلى GitHub يدوياً)',
        mode: 'local-disk',
        synced: false,
        projects: cleanedProjects,
        brands: cleanedBrands
      });
    }

    // Strategy C: Running on Vercel / serverless with NO GitHub Token configured
    return NextResponse.json({
      success: false,
      requiresToken: true,
      message: 'المزامنة السحابية غير مفعّلة: يجب ضبط متغير البيئة GITHUB_TOKEN في إعدادات Vercel ثم إعادة النشر.',
      error: 'GITHUB_TOKEN_REQUIRED'
    }, { status: 400 });

  } catch (err) {
    console.error('Save API error:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
      message: err.message
    }, { status: 500 });
  }
}
