import { makeCodeDemoShortcode } from './utils.js';

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 * @param {import('./typedefs').EleventyPluginCodeDemoOptions} options
 */
export const EleventyPluginCodeDemo = (eleventyConfig, options) => {
  const name = options.name ?? 'codeDemo';
  eleventyConfig.addPairedShortcode(name, makeCodeDemoShortcode({ ...options, name }));
};
