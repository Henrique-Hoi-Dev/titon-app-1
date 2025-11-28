/* eslint-disable */
// Plugin config do Expo requer uso de require() ao invés de import
const { withAppBuildGradle } = require('@expo/config-plugins')

/**
 * Plugin para remover a propriedade `enableBundleCompression` do build.gradle
 * Esta propriedade foi removida no React Native 0.74+ e não é mais suportada
 */
const withRemoveBundleCompression = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Remove a linha enableBundleCompression se existir
      config.modResults.contents = config.modResults.contents.replace(
        /^\s*enableBundleCompression\s*=\s*(true|false)\s*$/gm,
        '',
      )
      // Remove linhas vazias extras que possam ter sido criadas
      config.modResults.contents = config.modResults.contents.replace(
        /\n\s*\n\s*\n/g,
        '\n\n',
      )
    }
    return config
  })
}

module.exports = withRemoveBundleCompression
