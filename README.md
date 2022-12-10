# eleventy-plugin-code-demo

> Add interactive HTML/CSS/JS code demos to an Eleventy site using Markdown code blocks.

This plugin adds a paired shortcode to your 11ty site that converts HTML, CSS, and JS Markdown code blocks into an interactive iframe. It was inspired by Maciej Mionskowski's idea in the following article: [Building HTML, CSS, and JS code preview using iframe's srcdoc attribute](https://mionskowski.pl/posts/iframe-code-preview/). In short, iframes don't need to have a `src`; you can also define their markup inline with the [`HTMLIFrameElement.srcdoc`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) attribute.

I used this plugin extensively in the following interactive article: https://www.aleksandrhovhannisyan.com/blog/interactive-guide-to-javascript-events/. You may find it useful as a point of reference for what can be done.

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
  /* Render whatever document structure you want. The HTML, CSS, and JS parsed 
  from the shortcode's body are supplied to this function as an argument, so 
  you can position them wherever you want, or add class names or data-attributes to html/body */
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
  // key-value pairs for HTML attributes; these are applied to all code previews
  iframeAttributes: {
    height: '300',
    style: 'width: 100%;',
    frameborder: '0',
  },
});
```

See [example usage](#example-usage) for how to use the shortcode. There's also a [demo folder](./demo/) running a sample Eleventy project.

### Plugin Options

|Name|Type|Description|
|----|----|-----------|
|`name`|`string\|undefined`|Optional. The name to use for the shortcode. Defaults to `'codeDemo'` if not specified.|
|`renderDocument`|`(args: { html: string; css: string; js: string }) => string`|A render function to return custom markup for the document body of each iframe. This function will be called with the HTML, CSS, and JS parsed from your shortcode's children.|
|`iframeAttributes`|`Record<string, unknown>\|undefined`|Optional. Any HTML attributes you want to set globally on all code demos.|

### Shortcode Arguments

|Name|Type|Description|
|----|----|-----------|
|`source`|`string`|Implicit argument to the shortcode when you use the [paired shortcode](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) syntax in Eleventy. Contains all your Markdown code blocks.|
|`title`|`string`|A non-empty title for the code demo iframe. Required. Code demos without a title will throw an error.|
|`props`|`Record<string, unknown>`|Named keyword arguments for any HTML attributes you want to set on the iframe. See [Per-Usage HTML Attributes](#per-usage-html-attributes).|

### Example Usage

> **Note**: All code comments and whitespace are removed, and HTML is escaped to ensure that it doesn't break the iframe. You do not need to worry about doing this yourself. The only caveat is that you should never supply persistent user-generated code to this shortcode, as doing so could expose your site to XSS.

The shortcode renders as an interactive `<iframe>` powered by fenced Markdown code blocks defined in its body.

The following example creates a button with some simple CSS and a click listener:

````md
{% codeDemo 'Demo of a button that shows an alert when clicked' %}
```html
<button>Click me!</button>
```
```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
body,
html {
  height: 100%;
}
body {
  display: grid;
  place-content: center;
}
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

This renders as the following interactive button:

![A small rectangular iframe window with an inset border and a centered button that reads Click me](https://user-images.githubusercontent.com/19352442/206337332-a375ffa5-3fe1-4753-896e-5f5756cf6034.png)

With this output HTML:

```html
<iframe title="My iframe title" srcdoc="<!doctypehtml><style>*{box-sizing:border-box;padding:0;margin:0}body,html{height:100%}body{display:grid;place-content:center}button{padding:8px}</style><body><button>Click me!</button><script>const button=document.querySelector('button');button.addEventListener('click',()=>{alert('hello, 11ty!')})</script>" height="100" class="code-demo"></iframe>
```

A couple things to note:

- The order does not matter for the code blocks.
- All children are optional.
- Multiple code blocks of the same type (e.g., two CSS blocks) will be merged.
- Titles are required for accessibility, and an error will be thrown if you do not provide one.

### Interpolating Code Blocks

You could also define your code blocks separately and interpolate them. The following example uses Liquid's `{% capture %}` tags to do this, but you could also use Nunjucks's `{% set %}` to achieve the same result:

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

If you're using Nunjucks, you'll need to use [the `safe` filter](https://mozilla.github.io/nunjucks/templating.html#autoescaping) to opt out of auto-escaping the HTML.

### Per-Usage HTML Attributes

As we saw, you can set HTML attributes globally on all code demos in your `.eleventy.js` config using the `iframeAttributes` option, but you can also pass in attributes on a case-by-case basis. The example below leverages Nunjucks's support for [keyword arguments](https://mozilla.github.io/nunjucks/templating.html#keyword-arguments) to create a code demo that is 400 pixels tall:

````md
{% codeDemo 'Title', height="400" %}
```html
<button>Click me!</button>
```
{% endcodeDemo %}
````

> If you're using Liquid, keep an eye on this issue for keyword-argument support: https://github.com/11ty/eleventy/issues/2679. Or see my article here: [Passing Object Arguments to Liquid Shortcodes in 11ty](https://www.aleksandrhovhannisyan.com/blog/passing-object-arguments-to-liquid-shortcodes-in-11ty/).

## Use Cases and Motivation

On my site, I wanted to be able to create isolated, independent code demos containing only the markup, styling, and interactivity that I decided to give them, without having to reset styling from my website. I could use jsFiddle or Codepen, but those services typically load third-party JavaScript and may set third-party cookies.

I could create blank pages on my site and embed them as iframes, but that feels like overkill. Plus, I wanted to be able to show my users code snippets while keeping my demos in sync with the code. Stephanie Eckles wrote about [how to add static code demos to an 11ty site](https://11ty.rocks/posts/eleventy-templating-static-code-demos/), but I wanted to leverage iframes to:

1. Avoid having to wrangle with CSS specificity, and
2. Be able to write custom JavaScript isolated from the rest of the page.

