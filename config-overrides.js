const {
  disableEsLint,
  useBabelRc,
  override,
  fixBabelImports,
  addWebpackPlugin,
} = require('customize-cra')


const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

module.exports = override(
  disableEsLint(),
  // useBabelRc(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackPlugin(new AntdDayjsWebpackPlugin()),
)
