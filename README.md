# project-full
nuxt vue axios egg Mongodb
项目小结：
  登录：/login
  
  注册：/register
  
  用户中心：/user
  
  1.图片验证码 svgCaptcha.create({参数})

  2.邮箱验证码 nodemailer 邮箱服务器->注册邮箱
    npm install nodemailer -S
    
      
      const nodemailer = require('nodemailer');

      //创建一个SMTP客户端配置
      const transporter = nodemailer.createTransport({
        host: 'smtp.exmail.qq.com', // 这是腾讯的邮箱 host
        port: 465, // smtp 端口
        secureConnection: true,
        auth: {
          user: '', // 发送邮件的邮箱名
          pass: '', // 邮箱的授权码，也可以使用邮箱登陆密码
        },
      })
      
      transporter.sendMail(
        {
          from: '', // 发送人邮箱
          to: '', // 接收人邮箱，多个使用数组或用逗号隔开
          subject: 'xxxxxxxx', // 主题
          html: {}, // 邮件正文 可以为 HTML 或者 text 
        },
        (err) => {
          if (err) {
            throw err
          }
        },
      )
  3.axios管理token认证 
  
  4.图片上传
    文件管理 fs-extra
