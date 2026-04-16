import React from 'react';

export const REPO_NAME = '/slashdot-website-2026';

export function getImgPath(src: string | undefined) {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('https')) return src;
  // 1. Remove the repo name if it's already there
  let cleanPath = src.replace(REPO_NAME, '');

  // 2. Remove '/public' if it was included
  cleanPath = cleanPath.replace(/^\/?public/, '');

  // 3. Ensure it starts with a single slash
  const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  // 4. Final prefixing
  return `${REPO_NAME}${normalized}`;
}

/**
 * Standard MDX components to handle Repo-prefixed images in Markdown content.
 */
export const MDX_COMPONENTS = {
  img: (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={getImgPath(props.src)}
      alt={props.alt || ''}
      className="rounded-xl shadow-lg border border-black/5 dark:border-white/10 my-8 mx-auto"
    />
  ),
};
