import { getImgPath } from './imgUtils';

export interface MemeData {
  title: string;
  category: string;
  img: string;
  description: string;
  slug: string;
}

export interface GameData {
  title: string;
  description: string;
  url: string;
  imgUrl: string;
  tags: string[];
  slug: string;
}

export interface ArtData {
  title: string;
  blurColor: string;
  slug: string;
}

export const MEME_DATA: MemeData[] = [
  {
    title: 'The Developer\'s Classic: "It Works on My Machine"',
    category: "#ProgrammerHumor",
    img: "/images/memes/works-on-my-machine.webp",
    description: "A humorous take on the environment-specific bugs that plague developers. When a bug is reported, the first reaction is often to check if it works locally, leading to the infamous phrase.",
    slug: "works-on-my-machine",
  },
  {
    title: "UI vs. UX: The Desire Path",
    category: "#UXDesign",
    img: "/images/memes/ui-vs-ux-desire-path.jpg",
    description: "This meme perfectly illustrates the difference between User Interface (the paved path) and User Experience (the shortcut people actually take). It reminds designers that users will always find the most efficient route, regardless of the design.",
    slug: "ui-vs-ux-desire-path",
  },
  {
    title: "99 Little Bugs in the Code",
    category: "#DebuggingLife",
    img: "/images/memes/99-bugs-in-the-code.jpg",
    description: 'Based on the "99 Bottles of Beer" song, this meme describes the never-ending cycle of debugging where fixing one bug inevitably leads to discovering many more.',
    slug: "99-bugs-in-the-code",
  },
  {
    title: "Graphic Design is My Passion",
    category: "#GraphicDesign",
    img: "/images/memes/graphic-design-passion.jpg",
    description: 'A sarcastic meme featuring a poorly edited rainbow background and a frog. It is used by designers to mock low-quality design work or "client-ready" requests that ignore all design principles.',
    slug: "graphic-design-passion",
  },
  {
    title: "Frontend vs. Backend (The Horse)",
    category: "#WebDev",
    img: "/images/memes/frontend-vs-backend-horse.webp",
    description: "This meme shows a drawing of a horse where the front is a majestic, detailed masterpiece (Frontend) and the back is a crude stick-figure sketch (Backend), or vice versa, representing the disparity in polish between different parts of a project.",
    slug: "frontend-vs-backend-horse",
  },
  {
    title: "CSS Overflow: The Struggle is Real",
    category: "#CSS",
    img: "/images/memes/css-overflow-struggle.webp",
    description: 'A simple but effective visual of a container where the word "OVERFLOW" spills out of its borders. It’s a meta-commentary on the difficulty of mastering the CSS box model and layout properties.',
    slug: "css-overflow-struggle",
  },
];

export const GAME_DATA: GameData[] = [
  {
    title: "2048",
    description: "Join the numbers and get to the 2048 tile!",
    url: "https://play2048.co/",
    imgUrl: "/images/games/2048.jpg",
    tags: ["Puzzles"],
    slug: "game-2048",
  },
  {
    title: "Tetris",
    description: "The world favorite puzzle game. Clear lines, score high!",
    url: "https://play.tetris.com/",
    imgUrl: "/images/games/tetris.webp",
    tags: ["Classic"],
    slug: "game-tetris",
  },
  {
    title: "Clumsy Bird",
    description: "A retro-style arcade challenge. Don't hit the pipes!",
    url: "https://ellisonleao.github.io/clumsy-bird/",
    imgUrl: "/images/games/clumsy-bird.png",
    tags: ["Retro"],
    slug: "game-clumsy-bird",
  },
];

export const ART_DATA: ArtData[] = [
  {
    title: "The Primary Slant",
    blurColor: "var(--color-primary)",
    slug: "primary-slant",
  },
  {
    title: "Temporal Matrix",
    blurColor: "#06b6d4",
    slug: "temporal-matrix",
  },
  {
    title: "Hero Engine V2",
    blurColor: "#8a2be2",
    slug: "hero-engine",
  },
];
