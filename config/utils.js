const fs = require('fs')
const path = require('path')
const join = path.join

const resolve = dir => path.join(__dirname, '../', dir)

/**
 * @desc 大写转横杠
 * @param {*} str
 */
function upperCasetoLine(str) {
  let temp = str.replace(/[A-Z]/g, function (match) {
    return '-' + match.toLowerCase()
  })
  if (temp.slice(0, 1) === '-') {
    temp = temp.slice(1)
  }
  return temp
}

const callbackFile = (fileObj, path, item) => {
  //  文件路径
  const itemPath = join(path, item)
  //  在文件夹中
  const isDir = fs.statSync(itemPath).isDirectory()
  const [name, suffix] = item.split('.')

  //  文件中的入口文件
  if (isDir) {
    fileObj[`ucen-ol-${upperCasetoLine(item)}`] = resolve(join(itemPath, 'index.js'))
  } else if (suffix === 'js') {
    //  文件夹外的入口文件
    fileObj[name] = resolve(`${itemPath}`)
  }
  return fileObj
}

module.exports = {
  resolve,
  upperCasetoLine,
  /**
   * @desc 获取组件入口
   * @param {*} path
   */
  getComponentEntries(path) {
    if (Array.isArray(path)) {
      let componentEntries = {}
      path.forEach(m => {
        const files = fs.readdirSync(resolve(m))
        const componentEntry = files.reduce((fileObj, item) => {
          return callbackFile(fileObj, m, item)
        }, {})
        Object.assign(componentEntries, componentEntry)
      })
      return componentEntries
    } else {
      const files = fs.readdirSync(resolve(path))
      const componentEntries = files.reduce((fileObj, item) => {
        return callbackFile(fileObj, path, item)
      }, {})
      return componentEntries
    }
  }
}
