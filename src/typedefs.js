/**
 * @typedef RenderArgs
 * @property {string} css The CSS, if any, that was detected in the shortcode's usage.
 * @property {string} js The JavaScript, if any, that was detected in the shortcode's usage.
 * @property {string} html The HTML, if any, that was detected in the shortcode's usage.
 */

/**
 * @typedef EleventyPluginCodeDemoOptions
 * @property {string} name The shortcode name to use.
 * @property {(args: Pick<RenderArgs, 'css' | 'js'>) => string} renderHead A render function to render a custom HTML `<head>`.
 * @property {(args: Pick<RenderArgs, 'html' | 'js'>) => string} renderBody A render function to render a custom HTML `<body>`'s contents.
 * @property {Record<string, unknown>} iframeAttributes Any HTML attributes you want to set on the `<iframe>`.
 */

module.exports = {};
