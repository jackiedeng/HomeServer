'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const rpio = require('rpio');

class TemperatureSensor extends Controller {
  
    async index() {
    
    const { ctx } = this;

    //get gpio port 4 data

    rpio.open(4,rpio.INPUT);

    let data ="temperature:"+rpio.read(4);

    ctx.body = JSON.stringify({});
        
  }
}

module.exports = TemperatureSensor;
