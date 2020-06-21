'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/captcha', controller.util.captcha);
  router.post('/uploadfile', controller.util.uploadfile);
  router.group({name:'user', prefix:'/user'}, router => {
    const {login, register, info, verify} = controller.user;
    router.post('/register', register)
    router.post('/login', login)
    router.get('/info', info)
    router.get('/verify', verify)

  })
};
