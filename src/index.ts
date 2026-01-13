import type { ClassValue } from 'clsx';
import { makeCodeDemoShortcode } from './utils.js';

interface EleventyConfig {
  versionCheck: (versionRange: string) => void;
  addPairedAsyncShortcode: (
    name: string,
    shortcode: ReturnType<typeof makeCodeDemoShortcode>,
  ) => void;
}

interface RenderArgs {
  /** The CSS, if any, that was detected in the shortcode's usage. */
  css: string;
  /** The JavaScript, if any, that was detected in the shortcode's usage. */
  js: string;
  /** The HTML, if any, that was detected in the shortcode's usage. */
  html: string;
}

export interface EleventyPluginCodeDemoOptions {
  /** The shortcode name to use. */
  name: string;
  /** A function to render the iframe's document definition. */
  renderDocument: (args: RenderArgs) => string;
  /** Any HTML attributes you want to set on the `<iframe>` (optional). */
  iframeAttributes?: Record<string, ClassValue>;
}

export async function EleventyPluginCodeDemo(eleventyConfig: EleventyConfig, options: EleventyPluginCodeDemoOptions) {
  try {
    eleventyConfig.versionCheck('>=3.0');
  } catch (e) {
    if (e instanceof Error) {
      console.log(`[eleventy-plugin-code-demo] WARN Eleventy plugin compatibility: ${e.message}`);
    } else {
      console.log('[eleventy-plugin-code-demo] WARN Eleventy plugin compatibility: unknown error');
    }
  }
  const { name = 'codeDemo', ...otherOptions } = options;
  eleventyConfig.addPairedAsyncShortcode(name, makeCodeDemoShortcode(otherOptions));
}
