'use strict';
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');
const path = require('path')

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
    const {hash, name} = ctx.request.body

    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)
    // const filePath = path.resolve()

    if(!fse.existsSync(chunkPath)){
      await fse.mkdir(chunkPath)
    }

    console.log(this.config.UPLOAD_DIR , file.filepath);
    await fse.move(file.filepath, `${chunkPath}/${name}`)

    ctx.body = {
      code: 0,
      message: '切片上传成功'
    }

    // this.success({code:200})
  }
  async mergefile() {
    const {ext, size, hash} = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await this.ctx.service.tools.mergeFile(filePath, hash, size)
    this.ctx.body = {
      code: 0,
      data:
      {
        url: `/public/${hash}.${ext}`
      }
    }
  }
  async checkfile() {
    const { ctx } = this
    const {ext, hash} = ctx.request.body
    console.log('222222222222222222',ext)
    console.log('222222222222222222hash',hash)
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)

    console.log()
    let uploaded = false
    let uploadedList = []
    if(fse.existsSync(filePath)){
      uploaded = true
    }else {
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash))
    }

    this.ctx.body = {
      code: 0,
      message:{
        uploaded,
        uploadedList
      }
    }
  }
  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath) ? 
              (fse.readdir(dirPath)).filter(name=>name[0]!=='.') : []
  }

}

module.exports = UtilController;
