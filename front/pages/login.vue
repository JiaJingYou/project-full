<template>
    <div class="login-container">
        <el-form class="login-form">
            <el-form-item props="email">
                <span>
                    <li class="el-icon-mobile"> </li>
                </span>
                <el-input placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item props="pwd">
                <span>
                    <li class="el-icon-lock"> </li>
                </span>
                <el-input placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item props="captcha">
                <el-input placeholder="验证码"></el-input>
                <img class="pointer" @click="updateCaptcha" :src="captchaUrl">
            </el-form-item>
            <el-form-item>
                <el-button @click="loginBtn">登录</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
export default {
    layout:'login',
    data(){
        return{
            captchaUrl: '/api/captcha?_t' + new Date().getTime()
        }
        
    },
    methods:{
        updateCaptcha(){
            this.captchaUrl = '/api/captcha?_t' + new Date().getTime()
        },
        loginBtn() {
            this.$message.success('登录成功')
            localStorage.setItem('token', 'test')
            setTimeout(()=>{
                this.$router.push('/')
            }, 500)
        }
    }
}
</script>

<style lang="stylus">
    .pointer{
        cursor:pointer
    }
</style>