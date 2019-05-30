# better-templates

## Getting started
Clone the repo
```shell
npm i github:maanlamp/better-templates
```
### es6
to use it as an es6 module, just `import` it:
```js
import { render, html } from "better-templates/index.js";
```

### node
To use it as a commonjs/node module, just `import` it from je `.mjs` file:
```js
import { render, html } from "better-templates/index.mjs";
```
And make sure you use the `--experimental-modules` flag when running it in node.

## How it works
Render simple html with a pug/marko-like syntax.

```js
render`
  html[lang=en]
    head
      meta[charset=UTF-8]
      title "Document"
    body
      h1 "Hello World!"
`;
//Or
render(`
  html[lang=en]
    head
      meta[charset=UTF-8]
      title "Document"
    body
      h1 "Hello World!"
`);
```

Will result in:

```html
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

You can also transpile the simple-template to an HTML-string:

```js
html`
  html[lang=en]
    head
      meta[charset=UTF-8]
      title "Document"
    body
      h1 "Hello World!"
`;
// > "<html lang=\"en\"><head><meta charset="UTF-8"><title>Document</title></head><body><h1>Hello World!</h1></body></html>";
//Or
html(`
  html[lang=en]
    head
      meta[charset=UTF-8]
      title "Document"
    body
      h1 "Hello World!"
`);
// > "<html lang=\"en\"><head><meta charset="UTF-8"><title>Document</title></head><body><h1>Hello World!</h1></body></html>";
```
