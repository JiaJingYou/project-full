'use strict';
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');

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
  async uploadfile() {
    const {ctx} = this
    console.log(ctx.request);
    const file = ctx.request.files[0]
    console.log(this.config.UPLOAD_DIR , file.filepath);
    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename)
    this.success({code:200})
  }
}

module.exports = UtilController;
