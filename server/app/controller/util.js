'use strict';
const svgCaptcha = require('svg-captcha');

const Controller = require('egg').Controller;

class UtilController extends Controller {
  async captcha(){
    const captcha = svgCaptcha.create({
      size:4,
      fontSize:50,
      width:100,
      height:40,
      noise:3
    })
    const { ctx } = this;
    console.log("captcha====>", captcha.text);
    
    ctx.session.captcha = captcha.text;
    ctx.response.type = "image/svg+xml";
    ctx.body = captcha.data;
  }
}

module.exports = UtilController;
