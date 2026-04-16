const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirs = [
  { dir: 'content/blog',    type: 'blog' },
  { dir: 'content/events',  type: 'event' },
  { dir: 'content/projects', type: 'project' },
  { dir: 'content/funzone', type: 'funzone' },
  { dir: 'content/team',    type: 'team' },
];

const publicDir = path.join(__dirname, '../public');
const outputFile = path.join(publicDir, 'search-index.json');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Helper to extract snippet
function getSnippet(content) {
  if (!content) return '';
  return content
    .replace(/[#*`\n]/g, ' ') // Remove markdown symbols and newlines
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .substring(0, 200)
    .trim() + '...';
}

const searchIndex = [];

contentDirs.forEach(({ dir, type }) => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(fullPath);
  files.forEach(file => {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;

    try {
      const filePath = path.join(fullPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);

      // Graceful handling of missing frontmatter
      if (!frontmatter) {
        console.warn(`Skipping ${file}: No frontmatter found`);
        return;
      }

      const slug = file.replace(/\.mdx?$/, '');
      
      // Merge all searchable label sources into one unified tags array
      const rawTags = Array.isArray(frontmatter.tags)
        ? frontmatter.tags
        : (Array.isArray(frontmatter.tech_stack) ? frontmatter.tech_stack : []);
      
      // Always include category as a searchable tag so clicking 'Workshop',
      // 'Hackathon', 'meme', 'game' etc. on cards produces results
      // For team members, we include 'committee' as a searchable tag category
      const category = frontmatter.category || frontmatter.committee || '';
      const tags = category
        ? [...new Set([...rawTags, category])]
        : rawTags;

      let url = frontmatter.url || '';
      if (type === 'team') url = `/team#${slug}`;

      searchIndex.push({
        id: `${type}-${slug}`,
        title: frontmatter.title || frontmatter.name || slug,
        type: type,
        slug: slug,
        tags,
        description: frontmatter.description || frontmatter.bio || frontmatter.excerpt || getSnippet(content),
        category,
        date: frontmatter.date || '',
        image: frontmatter.image || frontmatter.coverImage || '',
        url: url,
        // Relational entity fields for @author and type: searches
        author: frontmatter.author || frontmatter.name || '',
        projectType: frontmatter.category || '',
        // Timing fields for live status detection
        time: frontmatter.time || '',
        schedule: frontmatter.schedule || [],
      });
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  });
});

fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
console.log(`\x1b[32m✔ Search index generated successfully with ${searchIndex.length} items.\x1b[0m`);
