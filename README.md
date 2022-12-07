# eleventy-plugin-code-demo

> Add interactive code demos to an Eleventy site using Markdown code blocks.

## Getting Started

Install the package:

```
yarn add eleventy-plugin-code-demo
```

Register it as a plugin in your Eleventy config:

```js
const { EleventyPluginCodeDemo } = require('eleventy-plugin-code-demo');

eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
  // Use any shortcode name you want
  name: 'shortcodeName',
  // Render whatever content you want to go in the <head>
  renderHead: ({ css }) => `<style>${css}</style>`,
  // Render whatever content you want to go in the <body>
  renderBody: ({ html, js }) => `${html}<script>${js}</script>`,
  // key-value pairs for HTML attributes; these are applied to all code previews
  iframeAttributes: {
    height: '300',
    style: 'width: 100%;',
    frameborder: '0',
  },
});
```

See [example usage](#example-usage) for how to use the shortcode.

### Plugin Options

|Name|Type|Description|
|----|----|-----------|
|`name`|`string`|The name to use for the shortcode. Defaults to `'codeDemo'` if not specified.|
|`renderHead`|`(args: { css: string; js: string }) => string`|A render function to return custom markup for the iframe `<head>`'s children.|
|`renderBody`|`(args: { html: string; js: string }) => string`|A render function to return custom markup for the iframe `<body>`'s children.|
|`iframeAttributes`|`Record<string, unknown>`|Any HTML attributes you want to set globally on all code demos.|

### Shortcode Arguments

|Name|Type|Description|
|----|----|-----------|
|`title`|`string`|A non-empty title for the code demo iframe.|
|`props`|`Record<string, unknown>`|Named keyword arguments for any HTML attributes you want to set on the iframe. See [example usage](#example-usage).|

### Example Usage

> **Note**: All code comments and whitespace are removed, and HTML tags are escaped. You do not need to worry about doing this yourself. The only caveat is that you should never forward user-generated code to this shortcode.

The shortcode renders as an interactive `<iframe>` powered by fenced Markdown code blocks defined in its body.

Here's an example that creates a button with some simple CSS and a click listener:

````md
{% codeDemo 'My iframe title' %}
```html
<button>Click me!</button>
```
```css
button {
  padding: 8px;
}
```
```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
  alert('hello, 11ty!');
});
```
{% endcodeDemo %}
````

A couple things to note:

- The order does not matter for the code blocks.
- All children are optional.
- Titles are required for accessibility, and an error will be thrown if you do not provide one.

### Interpolating Code Blocks

You could also define your code separately and interpolate it (example shown in Liquid using `{% capture %}` tags):

````md
{% capture html %}
```html
<button>Click me!</button>
```
{% endcapture %}
{% capture css %}
```css
button {
  padding: 8px;
}
```
{% endcapture %}
{% capture js %}
```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
  alert('hello, 11ty!');
});
```
{% endcapture %}

{% codeDemo 'Title' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}
````

### Setting HTML Attributes on the Code Demo

As we saw, you can set HTML attributes globally on all code demos in your `.eleventy.js` config using the `iframeAttributes` option, but you can also pass in attributes on a case-by-case basis. The example below leverages Nunjucks's support for [keyword arguments](https://mozilla.github.io/nunjucks/templating.html#keyword-arguments) to create a code demo that is 400 pixels tall:

````md
{% codeDemo 'Title', width="400" %}
```html
<button>Click me!</button>
```
{% endcodeDemo %}
````

> If you're using Liquid, keep an eye on this issue for keyword-argument support: https://github.com/11ty/eleventy/issues/2679. Or see my article here: [Passing Object Arguments to Liquid Shortcodes in 11ty](https://www.aleksandrhovhannisyan.com/blog/passing-object-arguments-to-liquid-shortcodes-in-11ty/).

## Use Cases and Motivation

On my site, I wanted to be able to create isolated, independent code demos containing only the markup, styling, and interactivity that I decided to give them. I could use jsFiddle or Codepen, but those services may not be around forever, and they also typically slow down your page load speed with JavaScript.

I could create blank pages on my site and embed them as iframes, but that feels like overkill. Plus, I wanted to be able to show my users code snippets while keeping my demos in sync with the code. Stephanie Eckles has written about [how to add static code demos to an 11ty site](https://11ty.rocks/posts/eleventy-templating-static-code-demos/), but I wanted to leverage iframes to:

1. Avoid having to wrangle with CSS specificity, and
2. Be able to write custom JavaScript isolated from the rest of the page.

## How It Works

This plugin was inspired by Maciej Mionskowski's idea in the following article: [Building HTML, CSS, and JS code preview using iframe's srcdoc attribute](https://mionskowski.pl/posts/iframe-code-preview/). In short, iframes allow us to define their markup using the `srcdoc` HTML attribute, which basically contains all of the markup for the page.

This plugin allows you to define your code snippets in a familiar way, complete with syntax highlighting, and then compresses all of your code into one long `srcdoc` string embedded in a lightweight iframe.
