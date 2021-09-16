'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/init', controller.home.initAdmin);

  /**
   * Jwt Controller
   */
  // Interface - Submit Login form 
  router.post('/jwtlogin', controller.jwt.doLogin);
  // Interface - Submit Register form 
  router.post('/jwtregister', controller.jwt.doRegister);

  /**
   * Request interception Middleware - Token verification(app/middleware/checktoken.js)
   *  请求拦截中间件-令牌验证
   *  app.middleware.checktoken()
   */
  // Interface - Get jwt's response info
  router.get('/jwtmsg', app.middleware.checktoken(), controller.jwt.getMsg)

  /**
   * User Controller
   */
  // Interface - index/create/destroy/update
  // RESTful style: https://eggjs.org/zh-cn/basics/router.html#restful-%E9%A3%8E%E6%A0%BC%E7%9A%84-url-%E5%AE%9A%E4%B9%89
  router.resources('user', '/user', controller.user)

  /**
   * Group Controller
   */
  // Interface - index/create/destroy/update
  router.resources('group', '/group', controller.group)
};
