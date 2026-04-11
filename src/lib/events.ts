import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getEventStatus } from './eventUtils';

export interface EventData {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    time: string;
    schedule?: { date: string; time: string }[];
    category: 'Workshop' | 'Seminar' | 'Hackathon';
    status: 'Live' | 'Upcoming' | 'Past';
    resources?: {
      youtube?: string;
      github?: string;
      slides?: string;
      docs?: string;
    };
    gallery?: string[];
  };
  content: string;
}

export function getEvents(): EventData[] {
  const targetDirectory = path.join(process.cwd(), 'content/events');
  
  if (!fs.existsSync(targetDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(targetDirectory);
  const allEvents = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(targetDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        frontmatter: matterResult.data as EventData['frontmatter'],
        content: matterResult.content,
      };
    });

  return allEvents.sort((a, b) => {
    const statusA = getEventStatus(a.frontmatter);
    const statusB = getEventStatus(b.frontmatter);

    const statusWeight = { Live: 3, Upcoming: 2, Past: 1 };
    const aWeight = statusWeight[statusA] || 0;
    const bWeight = statusWeight[statusB] || 0;

    if (aWeight !== bWeight) {
      return bWeight - aWeight; 
    }

    const dateA = a.frontmatter.date || '';
    const dateB = b.frontmatter.date || '';

    if (statusA === 'Upcoming') {
      return dateA.localeCompare(dateB);
    }
    
    return dateB.localeCompare(dateA);
  });
}

export function getEventBySlug(slug: string): EventData | null {
  const targetDirectory = path.join(process.cwd(), 'content/events');
  const fullPathTs = path.join(targetDirectory, `${slug}.md`);
  const fullPathMdx = path.join(targetDirectory, `${slug}.mdx`);

  let fileContents = '';
  if (fs.existsSync(fullPathTs)) {
    fileContents = fs.readFileSync(fullPathTs, 'utf8');
  } else if (fs.existsSync(fullPathMdx)) {
    fileContents = fs.readFileSync(fullPathMdx, 'utf8');
  } else {
    return null;
  }

  const matterResult = matter(fileContents);

  return {
    slug,
    frontmatter: matterResult.data as EventData['frontmatter'],
    content: matterResult.content,
  };
}
