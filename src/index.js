const escape = require('lodash/escape');
const minifyHtml = require('@minify-html/node');
const markdownIt = require('markdown-it');
const outdent = require('outdent');
const { parseCode, stringifyAttributes } = require('./utils');

const SHORTCODE_NAME = 'codeDemo';

/**
 * Higher-order function that takes user configuration options and returns the plugin shortcode.
 * @param {import('./typedefs').EleventyPluginCodeDemoOptions} options
 */
const makeCodeDemoShortcode = (options) => {
  /**
   * @param {string} source The children of this shortcode, as Markdown code blocks.
   * @param {string} title The title to set on the iframe.
   * @param {Record<string, unknown>} props HTML attributes to set on this specific `<iframe>`.
   */
  const codeDemoShortcode = (source, title, props = {}) => {
    if (!title) {
      throw new Error(`${SHORTCODE_NAME}: you must provide a non-empty title for the iframe.`);
    }

    const tokens = markdownIt().parse(source);
    const css = parseCode(tokens, 'css');
    const html = parseCode(tokens, 'html');
    const js = parseCode(tokens, 'js');
    const iframeAttributes = stringifyAttributes({ ...options.iframeAttributes, ...props });

    let srcdoc = `
  <!DOCTYPE html>
  <html>
    <head>${options.renderHead({ css, js })}</head>
    <body>${options.renderBody({ html, js })}</body>
  </html>`;

    // Convert all the HTML/CSS/JS into one long string with zero non-essential white space, comments, etc. Also escape HTML tags.
    srcdoc = escape(
      minifyHtml.minify(Buffer.from(srcdoc), {
        keep_spaces_between_attributes: false,
        // Only need to minify these two if they're present
        minify_css: !!css,
        minify_js: !!js,
      })
    );

    return outdent`<iframe title="${title}" srcdoc="${srcdoc}" ${iframeAttributes}></iframe>`;
  };

  return codeDemoShortcode;
};

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 * @param {EleventyPluginCodeDemoOptions} options
 */
const EleventyPluginCodeDemo = (eleventyConfig, options) => {
  eleventyConfig.addPairedShortcode(SHORTCODE_NAME, makeCodeDemoShortcode(options));
};

module.exports = { EleventyPluginCodeDemo };
