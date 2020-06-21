const BaseController = require('./base');
const cerateRule = {
  email:{type:"email"},
  nickname:{type:"string"},
  passwd:{type:"string"},
  captcha:{type:"string"},

}

class UserController extends BaseController {
  async register() {
    const {ctx} = this;
    try {
      ctx.validate(cerateRule);
    } catch (e) {
      return this.error('校验失败的参数', -1, e.errors)
    }
    const {email, nickname, passwd, captcha} = ctx.request.body;
    console.log(captcha.toUpperCase() !== ctx.session.captcha.toUpperCase());
    console.log(ctx.session.captcha);
    if(captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    this.success({code:200})
  }
  async info() {}
  async login() {}
  async verify() {}
}



module.exports = UserController;
