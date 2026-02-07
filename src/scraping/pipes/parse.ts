/**
 * Example:
 * - "2378 miembros" = 2378
 * - "73 mil miembros" = 73000
 */
export const parseMemberCount = (memberCountStr: string) => {
  const cleanStr = memberCountStr.trim().toLowerCase();
  const match = cleanStr.match(/([\d,.]+)\s*(mil|miembros?)?/);

  if (!match) return 0;

  let number = parseFloat(match[1].replace(',', '.'));

  // if have "mil", multiply for 1000
  // FIXME: this only work for Spanish languaje
  if (match[2] && match[2].includes('mil')) {
    number *= 1000;
  }

  return Math.round(number);
}

/**
 * Example:
 * - "+30 publicaciones al día" = 30
 * - "+90 publicaciones al día" = 90
 */
export const parsePostsPerDay = (postsStr: string) => {
  const cleanStr = postsStr.trim().toLowerCase();
  const match = cleanStr.match(/(\d+)/);

  if (!match) return 0;

  return parseInt(match[1], 10);
}
