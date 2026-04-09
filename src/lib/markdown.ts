import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MarkdownData {
  slug: string;
  frontmatter: any;
  content: string;
}

export function getMarkdownFiles(folderName: string): MarkdownData[] {
  const targetDirectory = path.join(process.cwd(), folderName);
  
  if (!fs.existsSync(targetDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(targetDirectory);
  const allMarkdownData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(targetDirectory, fileName);
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

export function getMarkdownFileBySlug(folderName: string, slug: string): MarkdownData | null {
  const targetDirectory = path.join(process.cwd(), folderName);
  const fullPath = path.join(targetDirectory, `${slug}.md`);
  const fullPathMdx = path.join(targetDirectory, `${slug}.mdx`);
  
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
