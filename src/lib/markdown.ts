import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MarkdownData {
  slug: string;
  frontmatter: any;
  content: string;
}

export function getMarkdownFiles(directoryPath: string): MarkdownData[] {
  const dirPath = path.join(contentDirectory, directoryPath);
  
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(dirPath);
  const allMarkdownData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".md" or ".mdx" from file name to get slug
      const slug = fileName.replace(/\.mdx?$/, '');

      // Read markdown file as string
      const fullPath = path.join(dirPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      return {
        slug,
        frontmatter: matterResult.data,
        content: matterResult.content,
      };
    });

  // Sort by date (descending)
  return allMarkdownData.sort((a, b) => {
    if ((a.frontmatter.date || '') < (b.frontmatter.date || '')) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getMarkdownFileBySlug(directoryPath: string, slug: string): MarkdownData | null {
  const fullPath = path.join(contentDirectory, directoryPath, `${slug}.md`);
  const fullPathMdx = path.join(contentDirectory, directoryPath, `${slug}.mdx`);
  
  let fileContents;
  try {
    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } else if (fs.existsSync(fullPathMdx)) {
      fileContents = fs.readFileSync(fullPathMdx, 'utf8');
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }

  const matterResult = matter(fileContents);

  return {
    slug,
    frontmatter: matterResult.data,
    content: matterResult.content,
  };
}
