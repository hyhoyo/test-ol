const { defineConfig } = require('@vue/cli-service');
const npmBuildConfig = require('./config/config.npm');
module.exports = process.env.ENV === 'npm' ? npmBuildConfig : defineConfig({ transpileDependencies: true });
