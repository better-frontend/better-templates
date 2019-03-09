# Mini template
Accepts a string with the following format:
- Starts with a tagname (`/\w+/`)
- followed by 1 or 0 #id (`/#\w+/`)
- followed by 0 or more .class (`/\.\w+/`)
- followed by 1 or 0 `/\[...\]/`
	- where `...` = 1 or more `/\w+(?:\s*=\s*\.+)?/`
	- where every match is separated by a comma and 0 or more spaces
- followed by 1 or 0 `/"[^"]*"/`
  - followed by 1 or more `/>/` `...`
  - where `...` = the entire pattern as described above.

## Example
```js
render(`
  div#test.container "This is a test"
    > p.child1 "This is a child"
      > p.child2 "This is a child's child."`);
```
Returns (as `HTMLElement`)
```html
<div id="test" class="container">
  This is a test
  <p class="child1">
    This is a child
    <p class="child2">This is a child's child.</p>
  </p>
</div>
```

## Logic
The is no logic (yet?). You will have to write loops that call `render` a lot of times.