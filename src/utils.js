/**
 * Given an array of tokens and a type of token to look up, finds all such matching tokens and returns one
 * big string concatenating all of those tokens' content.
 * @param {import('markdown-it/lib/token')[]} tokens
 * @param {string} type
 */
const parseCode = (tokens, type) =>
  tokens
    .filter((token) => token.info === type)
    .map((token) => token.content)
    .join('');

/** Maps a config of attribute-value pairs to an HTML string representing those same attribute-value pairs.
 * There's also this, but it's ESM only: https://github.com/sindresorhus/stringify-attributes
 * @param {Record<string, unknown>} attributeMap
 */
const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

module.exports = { parseCode, stringifyAttributes };
