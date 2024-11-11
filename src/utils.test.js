import { test, describe } from 'node:test';
import assert from 'node:assert';
import { outdent } from 'outdent';
import { makeCodeDemoShortcode } from './utils.js';

describe('makeCodeDemoShortcode', () => {
  test('includes html, css, and js', () => {
    const shortcode = makeCodeDemoShortcode({
      renderDocument: ({ html, css, js }) => `
      <!doctype html>
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>`,
    });
    const source = outdent`
        \`\`\`html
        <button>Click me</button>
        \`\`\`
        \`\`\`css
        button { padding: 0 }
        \`\`\`
        \`\`\`js
        console.log("test");
        \`\`\`
        `;
    assert.deepStrictEqual(
      shortcode(source, 'title'),
      `<iframe title="title" srcdoc="&lt;!doctypehtml&gt;&lt;style&gt;button{padding:0}&lt;/style&gt;&lt;body&gt;&lt;button&gt;Click me&lt;/button&gt;&lt;script&gt;console.log(&quot;test&quot;)&lt;/script&gt;"></iframe>`
    );
  });
  describe('merges multiple code blocks of the same type', () => {
    test('html', () => {
      const shortcode = makeCodeDemoShortcode({
        renderDocument: ({ html }) => `
        <!doctype html>
        <html>
        <head></head>
        <body>${html}</body>
        </html>`,
      });
      const source = outdent`
          \`\`\`html
          <button>1</button>
          \`\`\`
          \`\`\`html
          <button>2</button>
          \`\`\`
          `;
      assert.deepStrictEqual(
        shortcode(source, 'title'),
        `<iframe title="title" srcdoc="&lt;!doctypehtml&gt;&lt;body&gt;&lt;button&gt;1&lt;/button&gt;&lt;button&gt;2&lt;/button&gt;"></iframe>`
      );
    });
    test('css', () => {
      const shortcode = makeCodeDemoShortcode({
        renderDocument: ({ css }) => `
        <!doctype html>
        <html>
        <head><style>${css}</style></head>
        <body></body>
        </html>`,
      });
      const source = outdent`
          \`\`\`css
          * {
            padding: 0;
          }
          \`\`\`
          \`\`\`css
          * {
            margin: 0;
          }
          \`\`\`
          `;
      assert.deepStrictEqual(
        shortcode(source, 'title'),
        `<iframe title="title" srcdoc="&lt;!doctypehtml&gt;&lt;style&gt;*{padding:0;margin:0}&lt;/style&gt;&lt;body&gt;"></iframe>`
      );
    });
    test('js', () => {
      const shortcode = makeCodeDemoShortcode({
        renderDocument: ({ js }) => `
        <!doctype html>
        <html>
        <head></head>
        <body><script>${js}</script></body>
        </html>`,
      });
      const source = outdent`
          \`\`\`js
          console.log("one");
          \`\`\`
          \`\`\`js
          console.log("two");
          \`\`\`
          `;
      assert.deepStrictEqual(
        shortcode(source, 'title'),
        `<iframe title="title" srcdoc="&lt;!doctypehtml&gt;&lt;body&gt;&lt;script&gt;console.log(&quot;one&quot;);console.log(&quot;two&quot;)&lt;/script&gt;"></iframe>`
      );
    });
  });
  test('respects global and per-usage attributes', () => {
    const shortcode = makeCodeDemoShortcode({
      renderDocument: () => ``,
      iframeAttributes: { class: 'one', width: '300', height: '600' },
    });
    assert.deepStrictEqual(
      shortcode(``, 'title', { class: 'two' }),
      `<iframe title="title" srcdoc="" class="one two" width="300" height="600"></iframe>`
    );
  });
  test(`removes __keywords from Nunjucks keyword argument props`, () => {
    const shortcode = makeCodeDemoShortcode({
      renderDocument: () => ``,
    });
    assert.deepStrictEqual(shortcode(``, 'title', { __keywords: true }), `<iframe title="title" srcdoc=""></iframe>`);
  });
  test('throws an error if title is empty or undefined', () => {
    const shortcode = makeCodeDemoShortcode({ renderDocument: () => `` });
    assert.throws(() => shortcode(''));
    assert.throws(() => shortcode('', ''));
    assert.doesNotThrow(() => shortcode('', 'Non-empty title'));
  });
});
