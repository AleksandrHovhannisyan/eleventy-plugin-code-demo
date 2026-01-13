import markdownIt from 'markdown-it';
import { outdent } from 'outdent';
import clsx from 'clsx';
import { minify } from 'html-minifier-terser';
import type { EleventyPluginCodeDemoOptions } from './index.js';
import type { Token } from 'markdown-it/index.js';

const charactersToEscape = new Map([
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
]);

/**
 * Escapes special symbols in the given HTML string, returning a new string.
 */
function escapeHtml(string: string) {
  return string.replace(/[&<>"']/g, (char) => charactersToEscape.get(char) as string);
}

/**
 * Given an array of tokens and a type of token to look up, finds all such matching tokens and returns one
 * big string concatenating all of those tokens' content.
 */
function parseCode(tokens: Token[], type: string) {
  return tokens
    .filter((token) => token.info === type)
    .map((token) => token.content)
    .join('');
}

/** Maps a config of attribute-value pairs to an HTML string representing those same attribute-value pairs.
 */
function stringifyAttributes(attributeMap: Record<string, unknown>) {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
}

/**
 * Higher-order function that takes user configuration options and returns the plugin shortcode.
 */
export function makeCodeDemoShortcode(options: Omit<EleventyPluginCodeDemoOptions, 'name'>) {
  const sharedIframeAttributes = options.iframeAttributes;

  /**
   * @param {string} source The children of this shortcode, as Markdown code blocks.
   * @param {string} title The title to set on the iframe.
   * @param {Record<string, unknown>} props HTML attributes to set on this specific `<iframe>`.
   */
  return async function codeDemoShortcode(source: string, title: string, props: Record<string, unknown> = {}) {
    if (!title) {
      throw new Error(`[eleventy-plugin-code-demo]: you must provide a non-empty title for the iframe.`);
    }

    // This comes from Nunjucks when passing in keyword arguments; we don't want it to make its way into the output HTML
    if (props['__keywords']) {
      delete props['__keywords'];
    }

    const tokens = markdownIt().parse(source, {});
    const html = parseCode(tokens, 'html');
    const css = parseCode(tokens, 'css');
    const js = parseCode(tokens, 'js');

    // Allow users to customize their document structure, given this HTML, CSS, and JS
    let srcdoc = options.renderDocument({ html, css, js });
    // We have to check this or Buffer.from will throw segfaults
    if (srcdoc) {
      // Convert all the HTML/CSS/JS into one long string with zero non-essential white space, comments, etc.
      srcdoc = await minify(srcdoc, {
        preserveLineBreaks: false,
        collapseWhitespace: true,
        // Only need to minify these two if they're present
        minifyCSS: !!css,
        minifyJS: !!js,
      });
    }
    srcdoc = escapeHtml(srcdoc);

    const iframeAttributes = { ...sharedIframeAttributes, ...props };
    /* Do this separately to allow for multiple class names. Note that this should 
    technically also be done for other HTML attributes that could accept multiple 
    values, like aria-describedby. But it's not worth accounting for every possibility here. */
    const className = clsx(sharedIframeAttributes?.class, typeof props.class === 'string' ? props.class : undefined);
    if (className) {
      iframeAttributes.class = className;
    }
    const stringifiedAttributes = stringifyAttributes(iframeAttributes);

    return outdent`<iframe title="${title}" srcdoc="${srcdoc}"${
      stringifiedAttributes ? ` ${stringifiedAttributes}` : ''
    }></iframe>`;
  };
}
