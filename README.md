# Mini template
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