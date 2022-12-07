const { EleventyPluginCodeDemo } = require('./src');

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
    renderHead: ({ css }) => `<style>${css}</style>`,
    renderBody: ({ html, js }) => `${html}<script>${js}</script>`,
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
