'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    // This is egg's default render.
    // ctx.body = 'hi, egg';
    // Or you can use render nunjucks.(Already configured nunjucks in /config)
    await ctx.render('index')
  }
}

module.exports = HomeController;
