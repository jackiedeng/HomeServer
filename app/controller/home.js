'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    const data = fs.readFileSync(path.join(ctx.app.baseDir,'app/public/index.html'));

    ctx.body = data.toString();

    // ctx.body = "hello world";
  }
}

module.exports = HomeController;
