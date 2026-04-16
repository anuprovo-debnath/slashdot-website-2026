import { getImgPath } from './src/lib/imgUtils';

const testUrls = [
  'https://i.imgflip.com/1v2f63.jpg',
  '/images/games/2048.jpg',
  'images/games/tetris.webp'
];

testUrls.forEach(url => {
  console.log(`Input: ${url} | Output: ${getImgPath(url)}`);
});
