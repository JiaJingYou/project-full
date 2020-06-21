<template>
    <div>
        <h1>用户中心</h1>
        <div>
            <input type="file" name="file" @change="handleFileChange">
        </div>
        <div>
            <el-button @click="uploadFile"> 上传</el-button>
        </div>
    </div>
</template>
<script>
import { log } from 'util'
export default {
    async mounted(){
        // await this.$http.get('/user/info')
    },
    data(){
        return{
            file:null
        }
    },
    methods:{
        async uploadFile(){
            const form = new FormData()
            form.append('file', 'file')
            form.append('name', this.file)
            const ret = await this.$http.post('/api/uploadfile', form)
            console.log(ret);
            
        },
        handleFileChange(e){
            const [file] = e.target.files
            if(!file) return
            this.file = file;
        }
    }
}
</script>