import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ProjectData {
  slug: string;
  frontmatter: {
    title: string;
    category: 'Internal_Tools' | 'Other' | 'Member_Spotlight';
    status: 'Active' | 'Maintained' | 'Archived';
    tech_stack: string[];
    links: {
      github?: string;
      demo?: string;
      youtube?: string;
    };
    coverImage?: string;
    date?: string;
  };
  content: string;
}

export function getProjects(): ProjectData[] {
  const targetDirectory = path.join(process.cwd(), 'content/projects');
  
  if (!fs.existsSync(targetDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(targetDirectory);
  const allProjects = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(targetDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        frontmatter: matterResult.data as ProjectData['frontmatter'],
        content: matterResult.content,
      };
    });

  // Sort: Active first, then Date descending
  return allProjects.sort((a, b) => {
    if (a.frontmatter.status === 'Active' && b.frontmatter.status !== 'Active') return -1;
    if (a.frontmatter.status !== 'Active' && b.frontmatter.status === 'Active') return 1;
    
    const dateA = a.frontmatter.date || '';
    const dateB = b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });
}
