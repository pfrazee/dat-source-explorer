import {$, $$, render, safe} from './util.js'

// exported api
// =

export async function setup (containerEl, {url, folder, file} = {}) {
  url = url || window.location.toString()
  var archive = new DatArchive(url)

  return new SourceExplorer(containerEl, archive, {folder, file})
}

class SourceExplorer {
  constructor (containerEl, archive, {folder, file}) {
    this.containerEl = containerEl
    this.archive = archive

    this.currentFolder = folder || '/'
    if (!this.currentFolder.startsWith('/')) this.currentFolder = '/' + this.currentFolder
    if (!this.currentFolder.endsWith('/')) this.currentFolder = this.currentFolder + '/'

    this.currentFile = file || 'index.html'
    if (this.currentFile.startsWith('/')) this.currentFile = this.currentFile.slice(1)

    // setup dom
    this.editorEl = document.createElement('div')
    this.editorEl.classList.add('source-explorer-widget')
    this.editorEl.innerHTML = `
      <div class="header">source explorer <span class="current-file"></span></div>
      <div class="main">
        <div class="files-list"></div>
        <textarea readonly></textarea>
      </div>
    `
    this.containerEl.append(this.editorEl)

    // render
    this.renderFilesList()
    this.showFile(this.currentFile)
  }

  async renderFilesList () {
    var files = await this.archive.readdir(this.currentFolder, {stat: true})
    files.sort((a, b) => {
      if (a.stat.isDirectory() && !b.stat.isDirectory()) return -1
      if (!a.stat.isDirectory() && b.stat.isDirectory()) return 1
      return a.name.localeCompare(b.name)
    })

    var filesListEl = $(this.editorEl, '.files-list')
    filesListEl.innerHTML = `<div class="current-folder">${safe(this.currentFolder)}</div>`

    // up
    if (this.currentFolder !== '/') {
      filesListEl.append(render(`<div class="files-list-item up">..</div>`))
    }

    // files list
    files.forEach(file => {
      filesListEl.append(render(`
        <div
          class="files-list-item ${file.stat.isFile() ? 'file' : 'folder'}"
          data-name="${safe(file.name)}"
        >
          ${safe(file.name)}${file.stat.isFile() ? '' : '/'}
        </div>
      `))
    })

    // events
    $$(filesListEl, '.files-list-item.file').forEach(el => el.addEventListener('click', this.onClickFile.bind(this)))
    $$(filesListEl, '.files-list-item.folder').forEach(el => el.addEventListener('click', this.onClickFolder.bind(this)))
    $$(filesListEl, '.files-list-item.up').forEach(el => el.addEventListener('click', this.onClickUp.bind(this)))
  }

  async showFile (file) {
    this.currentFile = file
    $(this.editorEl, 'textarea').value = await this.archive.readFile(this.currentFolder + file, 'utf8')
    $(this.editorEl, '.current-file').textContent = this.currentFolder + file
  }

  onFileChanged () {
    this.renderFilesList()
  }

  onClickFile (e) {
    this.showFile(e.currentTarget.dataset.name)
  }

  onClickFolder (e) {
    this.currentFolder += e.currentTarget.dataset.name + '/'
    this.renderFilesList()
  }

  onClickUp (e) {
    this.currentFolder = this.currentFolder.split('/').slice(0, -2).join('/') + '/'
    this.renderFilesList()
  }
}
