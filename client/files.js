/**
 * 文件集合模块
 */

const paths = require('./paths.js')

class Files {
  constructor(_config, _options) {
    this.config = _config

    this.files = {}
    this.count = 0
    this.projectSocket = _options.projectSocket
  }

  create (_path, _content) {
    // 初始化地址
    const normalizedPath = paths.normalize(_path)
    const parsedPath = paths.parse(normalizedPath)

    // 获取文件
    let file = this.get(normalizedPath)

    if (file) {
      return false
    }

    // 创建文件信息
    file = {
      name: parsedPath.base,
      path: parsedPath.dir,
      content: _content
    }

    // 更新文件集合信息
    this.files[normalizedPath] = file
    this.count++

    // 触发事件
    this.projectSocket.emit('create_file', file)
  }

  delete (_path) {
    // 初始化地址
    const normalizedPath = paths.normalize(_path)

    // 获取文件
    let file = this.get(normalizedPath)

    if (file) {
      delete this.files[normalizedPath]
      this.count--

      // 触发事件
      this.projectSocket.emit('delete_file', file)

      return true
    }

    return false
  }

  get (_path, _force) {
    const force = !!_force

    // 强制更新
    if (force) {
      file = this.create(_path)
      return file
    }

    // 已经存在
    if (this.files[_path]) {
      return this.files[_path]
    }

    return false
  }

  describe () {
    const ret = {}
    ret.count = this.count
    ret.files = []

    for (const _filePath in this.files) {
      ret.files.push(this.files[_filePath])
    }
  }
}

module.exports = Files
