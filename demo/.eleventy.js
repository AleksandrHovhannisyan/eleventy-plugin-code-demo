import { EleventyPluginCodeDemo } from '../src/index.js';

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
export default function(eleventyConfig) {
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
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
  });

  return {
    dir: {
      input: '.',
      output: './_site',
    },
    markdownTemplateEngine: 'njk',
  };
};
