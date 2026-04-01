#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const PROJECT_ROOT = path.join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const DELETE = process.argv.includes('--delete');

// File extensions to check
const COMPONENT_EXTENSIONS = ['.astro', '.jsx', '.tsx', '.js'];
const SEARCH_EXTENSIONS = ['.astro', '.jsx', '.tsx', '.js', '.ts', '.mjs', '.mts'];

function getComponentName(filePath) {
  const basename = path.basename(filePath);
  return basename.split('.')[0];
}

function searchForImports(componentName, componentPath) {
  const componentRelativePath = path.relative(PROJECT_ROOT, componentPath);
  
  try {
    // Search for various import patterns
    const patterns = [
      `import.*${componentName}.*from`,
      `import.*from.*${componentName}`,
      `<${componentName}`,
      `<${componentName}\\s`,
      `export.*from.*${componentName}`,
      `require.*${componentName}`,
    ];

    // Build grep command to search in project
    let grepCmd = `grep -r "${componentName}" "${PROJECT_ROOT}/src" "${PROJECT_ROOT}/functions" `;
    grepCmd += `--include="*.astro" --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" `;
    grepCmd += `--exclude-dir=node_modules --exclude-dir=.astro 2>/dev/null || true`;

    const results = execSync(grepCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });

    // Filter out the component's own file
    const lines = results.split('\n').filter(line => {
      if (!line.trim()) return false;
      // Skip the component file itself
      if (line.includes(componentRelativePath)) return false;
      // Skip common false positives
      if (line.includes('// ') && !line.includes('import') && !line.includes('from')) return false;
      return true;
    });

    return lines.length > 0;
  } catch (error) {
    return false;
  }
}

function findAllComponents(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      findAllComponents(filePath, fileList);
    } else if (COMPONENT_EXTENSIONS.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function main() {
  console.log('🔍 Scanning components...\n');

  const components = findAllComponents(COMPONENTS_DIR);
  const unusedComponents = [];

  console.log(`Found ${components.length} component files\n`);

  components.forEach((componentPath) => {
    const componentName = getComponentName(componentPath);
    const relativePath = path.relative(PROJECT_ROOT, componentPath);
    const isImported = searchForImports(componentName, componentPath);

    if (isImported) {
      console.log(`✅ ${relativePath} - USED`);
    } else {
      console.log(`⚠️  ${relativePath} - UNUSED`);
      unusedComponents.push(componentPath);
    }
  });

  if (unusedComponents.length === 0) {
    console.log('\n✨ All components are being used!');
    return;
  }

  console.log(`\n\n📋 Found ${unusedComponents.length} unused component(s):\n`);
  unusedComponents.forEach((filePath) => {
    console.log(`  - ${path.relative(PROJECT_ROOT, filePath)}`);
  });

  if (DRY_RUN) {
    console.log('\n💭 Dry run mode: no files were deleted');
    console.log('   Run with --delete flag to remove unused components');
  } else if (DELETE) {
    console.log('\n🗑️  Deleting unused components...');
    unusedComponents.forEach((filePath) => {
      try {
        fs.unlinkSync(filePath);
        console.log(`   ✓ Deleted ${path.relative(PROJECT_ROOT, filePath)}`);
      } catch (error) {
        console.log(`   ✗ Failed to delete ${path.relative(PROJECT_ROOT, filePath)}: ${error.message}`);
      }
    });
    console.log('\n✨ Cleanup complete!');
  } else {
    console.log('\n💡 Run with --delete flag to remove these components');
    console.log('   Or run with --dry-run to see what would be deleted');
  }
}

main();
