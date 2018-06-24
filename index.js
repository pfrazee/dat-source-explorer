import * as explorer from 'dat://source-explorer.hashbase.io/explorer.js'

window.addEventListener('load', async () => {
  var container = document.body.querySelector('#example') 
  explorer.setup(container, {
    url: 'dat://source-explorer.hashbase.io',
    file: 'index.js'
  })
})
