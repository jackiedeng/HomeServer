/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602130476340_7934';

  // add your middleware config here
  config.middleware = [];

  config.cluster = {
        listen: {
            port: 80
        }
  };

  config.static={
    prefix:'/',
    dir: path.join(appInfo.baseDir,'app/public'),
    dynamic:true,
    preload:false,
    maxAge:0,
    buffer:false    
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
