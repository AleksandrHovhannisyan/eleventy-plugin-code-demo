const { makeCodeDemoShortcode } = require('./utils');

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 * @param {import('./typedefs').EleventyPluginCodeDemoOptions} options
 */
const EleventyPluginCodeDemo = (eleventyConfig, options) => {
  const name = options.name ?? 'codeDemo';
  eleventyConfig.addPairedShortcode(name, makeCodeDemoShortcode({ ...options, name }));
};

module.exports = { EleventyPluginCodeDemo };
