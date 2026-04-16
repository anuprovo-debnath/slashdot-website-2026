import { getMarkdownFiles } from "@/lib/markdown";
import FunZoneClientPage from "@/components/fun-zone/FunZoneClientPage";

export default async function FunZonePage() {
  const allContent = await getMarkdownFiles('content/funzone');
  
  // Group by category with case-insensitive and whitespace-safe matching
  const memes = allContent.filter(item => item.frontmatter.category?.trim().toLowerCase() === 'meme');
  const games = allContent.filter(item => item.frontmatter.category?.trim().toLowerCase() === 'game');
  const art = allContent.filter(item => {
    const cat = item.frontmatter.category?.trim().toLowerCase();
    return cat === 'art' || cat === 'design';
  });

  return (
    <FunZoneClientPage 
      memes={memes} 
      games={games} 
      art={art} 
    />
  );
}
