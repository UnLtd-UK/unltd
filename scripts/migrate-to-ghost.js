#!/usr/bin/env node

/**
 * Directus to Ghost Migration Script
 *
 * Migrates posts from Directus CMS (posts.json) to Ghost CMS format
 * - Downloads all images and files from Directus
 * - Transforms markdown content to Ghost HTML
 * - Generates Ghost-compatible JSON import file
 * - Creates a ZIP package ready for Ghost import
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { marked } from 'marked';
import { generate } from 'random-words';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  directusBaseUrl: 'https://unltd.directus.app/assets',
  postsJsonPath: path.join(PROJECT_ROOT, 'src/data/cache/posts.json'),
  outputDir: path.join(PROJECT_ROOT, 'ghost-export'),
  ghostVersion: '5.0.0'
};

// Helper to generate a unique hex ID (24 chars for Ghost)
function generateId() {
  return uuidv4().replace(/-/g, '').slice(0, 24);
}

// Helper to create date-based path (YYYY/MM)
function getDatePath(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}/${month}`;
}

// Helper to create a slug from a string
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to generate email from author name (lowercase, no spaces)
function generateAuthorEmail(name) {
  return name.toLowerCase().replace(/[^a-z]+/g, '') + '@unltd.org.uk';
}

// Helper to generate a 4-word password
function generatePassword() {
  return generate({ exactly: 4, join: '-' });
}

// Download a file from URL and save it
async function downloadFile(url, destPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  Warning: Failed to download ${url} - ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.writeFile(destPath, buffer);

    return {
      size: buffer.length,
      contentType: response.headers.get('content-type')
    };
  } catch (error) {
    console.warn(`  Warning: Error downloading ${url}: ${error.message}`);
    return null;
  }
}

// Get file extension from content type or URL
function getExtension(contentType, url) {
  const mimeToExt = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf'
  };

  if (contentType && mimeToExt[contentType]) {
    return mimeToExt[contentType];
  }

  // Try to get from URL
  const urlMatch = url.match(/\.([a-z]+)$/i);
  if (urlMatch) {
    return '.' + urlMatch[1].toLowerCase();
  }

  return '.jpg'; // Default
}

// Extract all Directus asset URLs from markdown content
function extractDirectusAssets(body) {
  const assets = {
    images: [],
    pdfs: []
  };

  if (!body) return assets;

  // Match markdown images: ![...](https://unltd.directus.app/assets/uuid)
  const imageRegex = /!\[([^\]]*)\]\((https:\/\/unltd\.directus\.app\/assets\/[a-f0-9-]+)\)/g;
  let match;
  while ((match = imageRegex.exec(body)) !== null) {
    assets.images.push({
      fullMatch: match[0],
      alt: match[1],
      url: match[2]
    });
  }

  // Match HTML img tags
  const imgTagRegex = /<img[^>]*src="(https:\/\/unltd\.directus\.app\/assets\/[a-f0-9-]+)"[^>]*>/g;
  while ((match = imgTagRegex.exec(body)) !== null) {
    const altMatch = match[0].match(/alt="([^"]*)"/);
    assets.images.push({
      fullMatch: match[0],
      alt: altMatch ? altMatch[1] : '',
      url: match[1],
      isHtmlImg: true
    });
  }

  // Match PDF embeds: <embed src="https://unltd.directus.app/assets/uuid" type="application/pdf"
  const pdfRegex = /<embed\s+src="(https:\/\/unltd\.directus\.app\/assets\/[a-f0-9-]+)"[^>]*type="application\/pdf"[^>]*\/?>/gi;
  while ((match = pdfRegex.exec(body)) !== null) {
    assets.pdfs.push({
      fullMatch: match[0],
      url: match[1]
    });
  }

  // Also match PDFs where type comes before src
  const pdfRegex2 = /<embed[^>]*type="application\/pdf"[^>]*src="(https:\/\/unltd\.directus\.app\/assets\/[a-f0-9-]+)"[^>]*\/?>/gi;
  while ((match = pdfRegex2.exec(body)) !== null) {
    // Avoid duplicates
    if (!assets.pdfs.some(p => p.url === match[1])) {
      assets.pdfs.push({
        fullMatch: match[0],
        url: match[1]
      });
    }
  }

  return assets;
}

// Extract YouTube embeds from content
function extractYouTubeEmbeds(body) {
  const embeds = [];
  if (!body) return embeds;

  // Match: <embed src="https://www.youtube.com/watch?v=VIDEO_ID" title="..." />
  // More flexible regex to handle various attribute orders
  const embedRegex = /<embed[^>]*src="(https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)[^"]*)"[^>]*\/?>/gi;
  let match;
  while ((match = embedRegex.exec(body)) !== null) {
    // Extract title separately since attribute order varies
    const titleMatch = match[0].match(/title="([^"]*)"/);
    embeds.push({
      fullMatch: match[0],
      url: match[1],
      videoId: match[2],
      title: titleMatch ? titleMatch[1] : ''
    });
  }

  return embeds;
}

// Extract figcaption from surrounding HTML
function extractFigcaption(body, imageMatch) {
  // Look for figcaption after the image
  const afterImage = body.slice(body.indexOf(imageMatch) + imageMatch.length);
  const captionMatch = afterImage.match(/^\s*<figcaption>([^<]+)<\/figcaption>/);
  if (captionMatch) {
    return captionMatch[1].trim();
  }

  // Check for caption in alt text with asterisks: ![alt *caption*](url)
  const altCaptionMatch = imageMatch.match(/!\[([^*]*)\*([^*]+)\*\]/);
  if (altCaptionMatch) {
    return altCaptionMatch[2].trim();
  }

  return null;
}

// Transform markdown body to Ghost HTML
function transformContentToHtml(body, assetMap, postSlug) {
  if (!body) return '';

  let html = body;

  // Replace Directus image references with Ghost paths
  for (const [originalUrl, ghostPath] of Object.entries(assetMap.images)) {
    // Get caption if exists
    const captionRegex = new RegExp(
      `!\\[([^\\]]*)\\]\\(${originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)\\s*(?:<figcaption>([^<]+)<\\/figcaption>)?(?:\\s*<\\/figure>)?`,
      'g'
    );

    html = html.replace(captionRegex, (match, alt, caption) => {
      const hasCaption = caption && caption.trim();
      const cardClass = hasCaption ? 'kg-card kg-image-card kg-card-hascaption' : 'kg-card kg-image-card';
      const captionHtml = hasCaption ? `<figcaption>${caption.trim()}</figcaption>` : '';
      return `<figure class="${cardClass}"><img src="${ghostPath}" class="kg-image" alt="${alt || ''}" loading="lazy">${captionHtml}</figure>`;
    });

    // Also replace standalone HTML img tags
    const imgTagRegex = new RegExp(
      `<img[^>]*src="${originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`,
      'g'
    );
    html = html.replace(imgTagRegex, (match) => {
      const altMatch = match.match(/alt="([^"]*)"/);
      const alt = altMatch ? altMatch[1] : '';
      return `<figure class="kg-card kg-image-card"><img src="${ghostPath}" class="kg-image" alt="${alt}" loading="lazy"></figure>`;
    });
  }

  // Replace PDF embeds with Ghost file cards
  for (const [originalUrl, fileInfo] of Object.entries(assetMap.pdfs)) {
    const pdfRegex = new RegExp(
      `<embed\\s+[^>]*src="${originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*\\/?>`,
      'gi'
    );

    html = html.replace(pdfRegex, () => {
      const sizeKB = Math.round(fileInfo.size / 1024);
      return `<div class="kg-card kg-file-card"><a class="kg-file-card-container" href="${fileInfo.ghostPath}" title="Download" download=""><div class="kg-file-card-contents"><div class="kg-file-card-title">${fileInfo.title}</div><div class="kg-file-card-metadata"><div class="kg-file-card-filename">${fileInfo.filename}</div><div class="kg-file-card-filesize">${sizeKB} KB</div></div></div><div class="kg-file-card-icon"><svg viewBox="0 0 24 24"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>download-circle</title><polyline class="a" points="8.25 14.25 12 18 15.75 14.25"></polyline><line class="a" x1="12" y1="6.75" x2="12" y2="18"></line><circle class="a" cx="12" cy="12" r="11.25"></circle></svg></div></a></div>`;
    });
  }

  // Transform YouTube embeds - extract from current html state
  const youtubeEmbeds = extractYouTubeEmbeds(html);
  for (const embed of youtubeEmbeds) {
    const iframeHtml = `<figure class="kg-card kg-embed-card"><iframe width="200" height="113" src="https://www.youtube.com/embed/${embed.videoId}?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" title="${embed.title}"></iframe></figure>`;
    html = html.replace(embed.fullMatch, iframeHtml);
  }

  // Remove orphaned </figure> tags
  html = html.replace(/^\s*<\/figure>\s*$/gm, '');

  // Convert remaining markdown to HTML using marked
  // First, protect our Ghost HTML from being processed
  // Use a format that won't be interpreted as markdown (no underscores)
  const protectedBlocks = [];
  html = html.replace(/<figure class="kg-card[^>]*>[\s\S]*?<\/figure>/g, (match) => {
    protectedBlocks.push(match);
    return `GHOSTBLOCK${protectedBlocks.length - 1}ENDBLOCK`;
  });
  html = html.replace(/<div class="kg-card[^>]*>[\s\S]*?<\/div>/g, (match) => {
    protectedBlocks.push(match);
    return `GHOSTBLOCK${protectedBlocks.length - 1}ENDBLOCK`;
  });

  // Convert markdown to HTML
  html = marked.parse(html);

  // Restore protected blocks
  protectedBlocks.forEach((block, index) => {
    html = html.replace(`GHOSTBLOCK${index}ENDBLOCK`, block);
    // Also handle case where it's wrapped in <p> tags
    html = html.replace(`<p>GHOSTBLOCK${index}ENDBLOCK</p>`, block);
  });

  return html;
}

// Process a single post
async function processPost(post, outputDir, postIndex) {
  console.log(`Processing: ${post.title}`);

  const datePath = getDatePath(post.date_time || post.date_created);
  const assetMap = {
    images: {},
    pdfs: {}
  };

  // Download featured image
  let featureImagePath = null;
  if (post.image) {
    const imageUrl = `${CONFIG.directusBaseUrl}/${post.image}`;
    console.log(`  Downloading featured image: ${post.image}`);

    const tempPath = path.join(outputDir, 'temp_featured');
    const result = await downloadFile(imageUrl, tempPath);

    if (result) {
      const ext = getExtension(result.contentType, imageUrl);
      const filename = `${post.slug}-featured${ext}`;
      const finalPath = path.join(outputDir, 'content/images', datePath, filename);

      await fs.mkdir(path.dirname(finalPath), { recursive: true });
      await fs.rename(tempPath, finalPath);

      featureImagePath = `__GHOST_URL__/content/images/${datePath}/${filename}`;
    }
  }

  // Extract and download body assets
  const assets = extractDirectusAssets(post.body);

  // Download body images
  let imageIndex = 1;
  for (const img of assets.images) {
    console.log(`  Downloading body image: ${img.url}`);

    const tempPath = path.join(outputDir, `temp_img_${imageIndex}`);
    const result = await downloadFile(img.url, tempPath);

    if (result) {
      const ext = getExtension(result.contentType, img.url);
      const filename = `${post.slug}-${imageIndex}${ext}`;
      const finalPath = path.join(outputDir, 'content/images', datePath, filename);

      await fs.mkdir(path.dirname(finalPath), { recursive: true });
      await fs.rename(tempPath, finalPath);

      assetMap.images[img.url] = `__GHOST_URL__/content/images/${datePath}/${filename}`;
    }
    imageIndex++;
  }

  // Download PDFs
  let pdfIndex = 1;
  for (const pdf of assets.pdfs) {
    console.log(`  Downloading PDF: ${pdf.url}`);

    const tempPath = path.join(outputDir, `temp_pdf_${pdfIndex}`);
    const result = await downloadFile(pdf.url, tempPath);

    if (result) {
      const filename = `${post.slug}-${pdfIndex}.pdf`;
      const finalPath = path.join(outputDir, 'content/files', datePath, filename);

      await fs.mkdir(path.dirname(finalPath), { recursive: true });
      await fs.rename(tempPath, finalPath);

      assetMap.pdfs[pdf.url] = {
        ghostPath: `__GHOST_URL__/content/files/${datePath}/${filename}`,
        filename: filename,
        title: `Document ${pdfIndex}`,
        size: result.size
      };
    }
    pdfIndex++;
  }

  // Transform content
  const htmlContent = transformContentToHtml(post.body, assetMap, post.slug);

  return {
    post,
    featureImagePath,
    htmlContent
  };
}

// Main migration function
async function migrate() {
  console.log('Starting Directus to Ghost migration...\n');

  // Read posts
  console.log('Reading posts.json...');
  const postsJson = await fs.readFile(CONFIG.postsJsonPath, 'utf-8');
  const posts = JSON.parse(postsJson);
  console.log(`Found ${posts.length} posts\n`);

  // Create output directory
  await fs.rm(CONFIG.outputDir, { recursive: true, force: true });
  await fs.mkdir(CONFIG.outputDir, { recursive: true });
  await fs.mkdir(path.join(CONFIG.outputDir, 'content/images'), { recursive: true });
  await fs.mkdir(path.join(CONFIG.outputDir, 'content/files'), { recursive: true });

  // Extract unique authors and tags
  const authorsMap = new Map();
  const tagsMap = new Map();
  const contributorCredentials = []; // Track credentials for export

  posts.forEach(post => {
    if (post.author_name && !authorsMap.has(post.author_name)) {
      const authorId = generateId();
      const email = generateAuthorEmail(post.author_name);
      const password = generatePassword();

      // Store credentials for export
      contributorCredentials.push({
        name: post.author_name,
        email: email,
        password: password
      });

      authorsMap.set(post.author_name, {
        id: authorId,
        name: post.author_name,
        slug: slugify(post.author_name),
        email: email,
        password: password,
        status: 'active',
        visibility: 'public',
        // Set role to Contributor (role_id will be set via roles table)
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    if (post.tag && !tagsMap.has(post.tag)) {
      const tagId = generateId();
      tagsMap.set(post.tag, {
        id: tagId,
        name: post.tag.charAt(0).toUpperCase() + post.tag.slice(1),
        slug: slugify(post.tag),
        visibility: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  });

  console.log(`Found ${authorsMap.size} unique authors`);
  console.log(`Found ${tagsMap.size} unique tags\n`);

  // Process each post
  const ghostPosts = [];
  const postsAuthors = [];
  const postsTags = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    // Only process published posts
    if (post.status !== 'published') {
      console.log(`Skipping draft: ${post.title}`);
      continue;
    }

    const processed = await processPost(post, CONFIG.outputDir, i);

    const postId = generateId();
    const postUuid = uuidv4();

    // Create Ghost post object
    const ghostPost = {
      id: postId,
      uuid: postUuid,
      title: processed.post.title,
      slug: processed.post.slug,
      mobiledoc: null,
      lexical: null,
      html: processed.htmlContent,
      comment_id: postId,
      plaintext: processed.post.body ? processed.post.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '',
      feature_image: processed.featureImagePath,
      // Ghost limits feature_image_alt to 191 characters
      feature_image_alt: processed.post.image_alt ? processed.post.image_alt.slice(0, 191) : null,
      feature_image_caption: processed.post.image_caption || null,
      featured: 0,
      type: 'post',
      status: 'published',
      locale: null,
      visibility: 'public',
      email_recipient_filter: 'all',
      created_at: processed.post.date_created,
      updated_at: processed.post.date_updated || processed.post.date_created,
      published_at: processed.post.date_time || processed.post.date_created,
      custom_excerpt: processed.post.description || null,
      codeinjection_head: null,
      codeinjection_foot: null,
      custom_template: null,
      canonical_url: null,
      newsletter_id: null,
      show_title_and_feature_image: 1
    };

    ghostPosts.push(ghostPost);

    // Create post-author relationship
    if (processed.post.author_name && authorsMap.has(processed.post.author_name)) {
      postsAuthors.push({
        id: generateId(),
        post_id: postId,
        author_id: authorsMap.get(processed.post.author_name).id,
        sort_order: 0
      });
    }

    // Create post-tag relationship
    if (processed.post.tag && tagsMap.has(processed.post.tag)) {
      postsTags.push({
        id: generateId(),
        post_id: postId,
        tag_id: tagsMap.get(processed.post.tag).id,
        sort_order: 0
      });
    }

    console.log('');
  }

  // Define the Contributor role (Ghost's built-in role ID for Contributor)
  const contributorRoleId = generateId();
  const roles = [{
    id: contributorRoleId,
    name: 'Contributor',
    description: 'Contributors can create and edit their own draft posts, but cannot publish.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }];

  // Create roles_users entries to assign all authors as Contributors
  const rolesUsers = Array.from(authorsMap.values()).map(author => ({
    id: generateId(),
    role_id: contributorRoleId,
    user_id: author.id
  }));

  // Build Ghost JSON structure
  const ghostData = {
    db: [{
      meta: {
        exported_on: Date.now(),
        version: CONFIG.ghostVersion
      },
      data: {
        posts: ghostPosts,
        posts_authors: postsAuthors,
        posts_tags: postsTags,
        tags: Array.from(tagsMap.values()),
        users: Array.from(authorsMap.values()),
        roles: roles,
        roles_users: rolesUsers
      }
    }]
  };

  // Write JSON file
  const jsonPath = path.join(CONFIG.outputDir, 'ghost-import.json');
  await fs.writeFile(jsonPath, JSON.stringify(ghostData, null, 2));
  console.log(`\nWritten Ghost JSON to: ${jsonPath}`);

  // Write contributor credentials file
  const credentialsPath = path.join(CONFIG.outputDir, 'contributor-credentials.csv');
  const csvHeader = 'Name,Email,Password\n';
  const csvRows = contributorCredentials.map(c => `"${c.name}","${c.email}","${c.password}"`).join('\n');
  await fs.writeFile(credentialsPath, csvHeader + csvRows);
  console.log(`Written contributor credentials to: ${credentialsPath}`);

  // Create ZIP file
  const zipPath = path.join(CONFIG.outputDir, 'ghost-import.zip');
  const output = createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);

  // Add JSON file
  archive.file(jsonPath, { name: 'ghost-import.json' });

  // Add content folders
  archive.directory(path.join(CONFIG.outputDir, 'content'), 'content');

  await archive.finalize();

  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    output.on('error', reject);
  });

  console.log(`Created ZIP file: ${zipPath}`);
  console.log(`\nMigration complete!`);
  console.log(`\nTo import into Ghost:`);
  console.log(`1. Go to Ghost Admin > Settings > Labs`);
  console.log(`2. Under "Import content", upload: ${zipPath}`);
  console.log(`\nStats:`);
  console.log(`- Posts: ${ghostPosts.length}`);
  console.log(`- Authors: ${authorsMap.size}`);
  console.log(`- Tags: ${tagsMap.size}`);
}

// Run migration
migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
