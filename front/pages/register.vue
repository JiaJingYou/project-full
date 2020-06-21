<template>
    <div class="login-container">
        <el-form class="login-form" label-width="100px" :model="form" :rules="rules" ref="registerForm"> 
            <el-form-item prop="email" label="邮箱">
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="captcha" label="验证码" class="captcha-container">
                <div class="captcha">
                    <img @click="updateCaptcha" :src="captchaUrl">
                </div>
                <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
            </el-form-item>


            <el-form-item prop="nickname" label="昵称">
                <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item prop="passwd" label="密码">
                <el-input v-model="form.passwd" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="repasswd" label="确认密码">
                <el-input v-model="form.repasswd" placeholder="请输入确认密码"></el-input>
            </el-form-item>
            

            <el-form-item prop="repasswd" label=" ">
                <el-button type="primary" @click.native.prevent="handlerReg">注册</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
import md5 from 'md5';
export default {
    layout:'login',
    data(){
        return{
            form:{
                email:"237390045@qq.com",
                nickname:"牛牛",   
                passwd:"youjiajing0",
                repasswd: "youjiajing0",
                captcha:"",
            },
            rules:{
                email:[
                    {required:true, message:"请输入邮箱"},
                    // {type:"email", message:"请输入正确的邮箱格式"},
                ],
                captcha:[
                    {required:true, message:"请输入验证码"}
                ],
                nickname:[
                    {required:true, message:"请输入昵称"}
                ],
                passwd:[
                    {required:true,pattern:/^[\w_-]{6,12}$/g, message:"请输入6-12位密码"}
                ],
                repasswd:[
                    {required:true,pattern:/^[\w_-]{6,12}$/g, message:"请输入确认密码"},
                    {validator:(rules,value,callback) => {
                        if(value !== this.form.passwd){
                            callback(new Error('两次密码不一致！'))
                        }
                        callback()
                    }}
                ]
            },
            captchaUrl: '/api/captcha?_t' + new Date().getTime()
        }
        
    },
    methods:{
        updateCaptcha(){
            this.captchaUrl = '/api/captcha?_t' + new Date().getTime()
        },
        handlerReg(){
            this.$refs.registerForm.validate(async valid=>{
                if(valid) {
                    console.log('校验成功');
                    let obj = {
                        email: this.form.email,
                        nickname: this.form.nickname,
                        passwd: md5(this.form.passwd),
                        captcha: this.form.captcha
                    }
                    let ret = await this.$http.post('/api/user/register', obj);
                    if(ret.data.code == 0){
                        this.$alert('注册成功', '成功', {
                            callback:() => {
                                this.$router.push('/login')
                            }
                        })
                    }else {
                        this.$alert( ret.data.message, '校验失败', {})
                    }
                } else {
                    console.log('校验失败');
                }
            })
        }
    }
}
</script>

<style lang="stylus">
    .pointer{
        cursor:pointer
    }
</style>