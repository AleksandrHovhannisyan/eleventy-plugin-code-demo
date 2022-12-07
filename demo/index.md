---
permalink: /
---

Below is an interactive code demo:

{% codeDemo 'Code demo', height="400" %}
```html
<div class="buttons">
    <button aria-label="Increment" data-step="1">&plus;</button>
    <button aria-label="Decrement" data-step="-1">&minus;</button>
</div>
<output>0</output>
```

```css
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
html,
body {
    height: 100%;
}
body {
    display: grid;
    place-content: center;
    text-align: center;
}
.buttons {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
}
button {
    padding: 4px;
    line-height: 1;
}
```

```js
const buttons = document.querySelectorAll('[data-step]');
const output = document.querySelector('output');
let count = Number(output.innerHTML);
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        count += Number(button.getAttribute('data-step'));
        output.innerHTML = count;
    });
});;
```
{% endcodeDemo %}