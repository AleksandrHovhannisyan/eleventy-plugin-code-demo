const escape = require('lodash/escape');
const minifyHtml = require('@minify-html/node');
const markdownIt = require('markdown-it');
const outdent = require('outdent');
const clsx = require('clsx');

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

/**
 * Higher-order function that takes user configuration options and returns the plugin shortcode.
 * @param {import('./typedefs').EleventyPluginCodeDemoOptions} options
 */
const makeCodeDemoShortcode = (options) => {
  const sharedIframeAttributes = options.iframeAttributes;

  /**
   * @param {string} source The children of this shortcode, as Markdown code blocks.
   * @param {string} title The title to set on the iframe.
   * @param {Record<string, unknown>} props HTML attributes to set on this specific `<iframe>`.
   */
  const codeDemoShortcode = (source, title, props = {}) => {
    if (!title) {
      throw new Error(`${options.name}: you must provide a non-empty title for the iframe.`);
    }

    // This comes from Nunjucks when passing in keyword arguments; we don't want it to make its way into the output HTML
    if (props['__keywords']) {
      delete props['__keywords'];
    }

    const tokens = markdownIt().parse(source);
    const html = parseCode(tokens, 'html');
    const css = parseCode(tokens, 'css');
    const js = parseCode(tokens, 'js');

    // Allow users to customize their document structure, given this HTML, CSS, and JS
    let srcdoc = options.renderDocument({ html, css, js });
    // We have to check this or Buffer.from will throw segfaults
    if (srcdoc) {
      // Convert all the HTML/CSS/JS into one long string with zero non-essential white space, comments, etc.
      srcdoc = minifyHtml.minify(Buffer.from(srcdoc), {
        keep_spaces_between_attributes: false,
        // Only need to minify these two if they're present
        minify_css: !!css,
        minify_js: !!js,
      });
    }
    srcdoc = escape(srcdoc);

    let iframeAttributes = { ...sharedIframeAttributes, ...props };
    /* Do this separately to allow for multiple class names. Note that this should 
    technically also be done for other HTML attributes that could accept multiple 
    values, like aria-describedby. But it's not worth accounting for every possibility here. */
    const className = clsx(sharedIframeAttributes?.class, props.class);
    if (className) {
      iframeAttributes.class = className;
    }
    iframeAttributes = stringifyAttributes(iframeAttributes);

    return outdent`<iframe title="${title}" srcdoc="${srcdoc}"${
      iframeAttributes ? ` ${iframeAttributes}` : ''
    }></iframe>`;
  };

  return codeDemoShortcode;
};

module.exports = { makeCodeDemoShortcode };
