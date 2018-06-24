# Dat Source Explorer

A helpful widget for viewing the source of a dat site.

[dat://source-explorer.hashbase.io](dat://source-explorer.hashbase.io)

## Usage

Import the CSS and Javascript into your site. In your HTML:

```css
<link rel="stylesheet" href="dat://source-explorer.hashbase.io/explorer.css">
```

In your Javascript:

```js
import * as explorer from 'dat://source-explorer.hashbase.io/explorer.js'

explorer.setup(document.body, {
  url: window.location.toString(), // defaults to window.location
  folder: '/',                     // defaults to '/'
  file: 'index.html'               // defaults to 'index.html'
})
```