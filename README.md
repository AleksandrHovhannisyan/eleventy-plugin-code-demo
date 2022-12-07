# eleventy-plugin-code-demo

## Getting Started

Install the package:

```
yarn add eleventy-plugin-code-demo
```

Register it as a plugin in your Eleventy config:

```js
const { EleventyPluginCodeDemo } = require('eleventy-plugin-code-demo');

eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
  // Render whatever content you want to go in the <head>
  renderHead: ({ css }) => `<style>${css}</style>`,
  // Render whatever content you want to go in the <body>
  renderBody: ({ html, js }) => `${html}<script>${js}</script>`,
  // key-value pairs for HTML attributes; these are applied to all code previews
  props: {
    height: '300',
    style: 'width: 100%;',
    frameborder: '0',
  },
});
```

### Example Usage

The shortcode will render as an interactive iframe powered by the fenced code blocks that you define in its body:

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

You could also define the code separately and interpolate it (example in Liquid):

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

Note that the order does not matter. Also, all children are optional.

## Use Cases and Motivation

On my site, I wanted to be able to create isolated, independent code demos containing only the markup, styling, and interactivity that I decided to give them. I could use jsFiddle or Codepen, but those services may not be around forever, and they also typically slow down your page load speed with JavaScript.

I could create blank pages on my site and embed them as iframes, but that feels like overkill. Plus, I wanted to be able to show my users code snippets while keeping my demos in sync with the code. Stephanie Eckles has written about [how to add static code demos to an 11ty site](https://11ty.rocks/posts/eleventy-templating-static-code-demos/), but I wanted to leverage iframes to:

1. Avoid having to wrangle with CSS specificity, and
2. Be able to write custom JavaScript isolated from the rest of the page.

## How It Works

This plugin was inspired by Maciej Mionskowski's idea in the following article: [Building HTML, CSS, and JS code preview using iframe's srcdoc attribute](https://mionskowski.pl/posts/iframe-code-preview/). In short, iframes allow us to define their markup using the `srcdoc` HTML attribute, which basically contains all of the markup for the page.

This plugin allows you to define your code snippets in a familiar way, complete with syntax highlighting, and then compresses all of your code into one long `srcdoc` string embedded in a lightweight iframe.
