const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 [Auto-Sync] Service started. Watching public/projects and data/ for changes...');

let debounceTimer = null;
let isSyncing = false;

function syncToGitHub() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    // Check if there are changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (!status) {
      isSyncing = false;
      return;
    }

    console.log('\n🚀 [Auto-Sync] New files or changes detected! Pushing to GitHub...');
    execSync('git config core.quotepath false');
    execSync('git add .');
    const commitMsg = `sync: auto-upload project assets (${new Date().toLocaleTimeString()})`;
    execSync(`git commit -m "${commitMsg}"`);
    console.log('📤 [Auto-Sync] Pushing to origin main...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ [Auto-Sync] Successfully pushed to GitHub!\n');
  } catch (err) {
    console.error('⚠️ [Auto-Sync] Error during sync:', err.message);
  } finally {
    isSyncing = false;
  }
}

function triggerSync() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    syncToGitHub();
  }, 4000); // 4-second debounce to let file copies finish
}

// Watch public/projects
const projectsDir = path.join(__dirname, '..', 'public', 'projects');
if (fs.existsSync(projectsDir)) {
  fs.watch(projectsDir, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.DS_Store') || filename.includes('.git'))) return;
    console.log(`📁 [Auto-Sync] Detected ${eventType} in: ${filename}`);
    triggerSync();
  });
}

// Watch data
const dataDir = path.join(__dirname, '..', 'data');
if (fs.existsSync(dataDir)) {
  fs.watch(dataDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.DS_Store')) return;
    console.log(`📄 [Auto-Sync] Detected ${eventType} in data: ${filename}`);
    triggerSync();
  });
}

// Initial check on start
syncToGitHub();
