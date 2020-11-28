'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const rpio = require('rpio');

const pin = 7;

class GpIODev extends Controller {
  async index() {
    const { ctx } = this;

    rpio.open(pin,rpio.INPUT);
    let result = "read:"+rpio.read(pin);

    ctx.body = result;
  }
}

module.exports = GpIODev;
