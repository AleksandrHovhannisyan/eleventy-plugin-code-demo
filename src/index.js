import { makeCodeDemoShortcode } from './utils.js';

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 * @param {import('./typedefs').EleventyPluginCodeDemoOptions} options
 */
export async function EleventyPluginCodeDemo(eleventyConfig, options) {
  try {
    eleventyConfig.versionCheck('>=3.0');
  } catch (e) {
    console.log(`[eleventy-plugin-code-demo] WARN Eleventy plugin compatibility: ${e.message}`);
  }
  const name = options.name ?? 'codeDemo';
  eleventyConfig.addPairedAsyncShortcode(name, makeCodeDemoShortcode({ ...options, name }));
}
