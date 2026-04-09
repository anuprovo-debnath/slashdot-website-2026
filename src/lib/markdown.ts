import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MarkdownData {
  slug: string;
  frontmatter: any;
  content: string;
}

export function getMarkdownFiles(directoryPath: string): MarkdownData[] {
  // Wrap with process.cwd() inside the function to fix the Turbopack NFT list warning
  const dirPath = path.join(process.cwd(), directoryPath);
  
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(dirPath);
  const allMarkdownData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(dirPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        frontmatter: matterResult.data,
        content: matterResult.content,
      };
    });

  return allMarkdownData.sort((a, b) => {
    if ((a.frontmatter?.date || '') < (b.frontmatter?.date || '')) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getMarkdownFileBySlug(directoryPath: string, slug: string): MarkdownData | null {
  // Wrap with process.cwd() inside the function
  const dirPath = path.join(process.cwd(), directoryPath);
  const fullPath = path.join(dirPath, `${slug}.md`);
  const fullPathMdx = path.join(dirPath, `${slug}.mdx`);
  
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
