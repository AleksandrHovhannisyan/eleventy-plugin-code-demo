const { EleventyPluginCodeDemo } = require('./src');

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
module.exports = (eleventyConfig) => {
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
      input: 'demo',
      output: '_site',
    },
    markdownTemplateEngine: 'njk',
  };
};
