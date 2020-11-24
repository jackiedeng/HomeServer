'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class TemperatureSensor extends Controller {
  
    async index() {
    const { ctx } = this;

    let data ={"temperature":"1"};

    ctx.body = data.toString();

  }
}

module.exports = TemperatureSensor;
