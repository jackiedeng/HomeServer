'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getTemperature',controller.temperatureSensor.index);
  router.get('/dev',controller.gpioDev.index);
};
