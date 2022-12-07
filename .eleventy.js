const { EleventyPluginCodeDemo } = require('./src');

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
    renderDocument: ({ html, css, js }) => `
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
