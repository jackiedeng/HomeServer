'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const rpio = require('rpio');
const sensor = require("node-dht-sensor");
const { error } = require('console');
//GPIO 4
let GPIOPort = 4;

class TemperatureSensor extends Controller {
  
    async index() {
    
    const { ctx } = this;
    // ctx.logger.error("begin temperature read!!!");
    // ctx.body = JSON.stringify({"d":123});  
    try{

      sensor.read(11, GPIOPort, function(err, temperature, humidity) {
        if (!err) {
          ctx.logger.debug(`temp: ${temperature}°C, humidity: ${humidity}%`);
        }else{
          ctx.logger.error('error'+err);
        }
      });

      ctx.body = JSON.stringify("ok");

    }catch(e){
      ctx.logger.error("error:"+JSON.stringify(e));
    }

  
  }
}

module.exports = TemperatureSensor;
