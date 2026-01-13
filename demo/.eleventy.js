import { EleventyPluginCodeDemo } from '../dist/index.js';

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
export default function(eleventyConfig) {
  eleventyConfig.ignores.add("README.md");
  /** @type {import('../dist/index.js').EleventyPluginCodeDemoOptions} */
  const options = {
    renderDocument: ({ html, css, js }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>`,
    iframeAttributes: {
      height: '100',
      class: 'code-demo',
    },
  }
  eleventyConfig.addPlugin(EleventyPluginCodeDemo, options);

  return {
    dir: {
      input: '.',
      output: './_site',
    },
    markdownTemplateEngine: 'njk',
  };
};
