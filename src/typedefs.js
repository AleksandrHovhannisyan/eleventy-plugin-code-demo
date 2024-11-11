/**
 * @typedef RenderArgs
 * @property {string} css The CSS, if any, that was detected in the shortcode's usage.
 * @property {string} js The JavaScript, if any, that was detected in the shortcode's usage.
 * @property {string} html The HTML, if any, that was detected in the shortcode's usage.
 */

/**
 * @typedef EleventyPluginCodeDemoOptions
 * @property {string} name The shortcode name to use.
 * @property {(args: RenderArgs) => string} renderDocument A render function to render the iframe's document definition.
 * @property {Record<string, unknown>} [iframeAttributes] Any HTML attributes you want to set on the `<iframe>` (optional).
 */

export default {};
