<template>
    <div>
        <h1>用户中心</h1>
        <div ref="drag" id="drag"> 
            <input type="file" name="file" @change="handleFileChange">
        </div>
        <div>
            <el-progress stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
        </div>
        <div>
            <el-button @click="uploadFile"> 上传</el-button>
        </div>
    </div>
</template>
<style lang="stylus">
#drag 
    height 200px
    line-height 100px
    border 2px dashed #eeeeee
    text-align center
</style>
<script>
import { log } from 'util'
export default {
    async mounted(){
        // await this.$http.get('/user/info')
        this.bindEvents();
    },
    data(){
        return{
            file:null,
            uploadProgress: 0
        }
    },
    methods:{
        bindEvents(){
            const drag = this.$refs.drag
            drag.addEventListener('dragover', e=>{
                drag.style.borderColor = 'red'
                e.preventDefault()
            })
            drag.addEventListener('dragleave', e=>{
                drag.style.borderColor = '#eee'
                e.preventDefault()
            })
            drag.addEventListener('drop', e=>{
                drag.style.borderColor = '#eee'
                const fileList = e.dataTransfer.files
                this.file = fileList[0]
                e.preventDefault()
            })
        },
        async uploadFile(){
            const form = new FormData()
            form.append('file', 'file')
            form.append('name', this.file)
            const ret = await this.$http.post('/api/uploadfile', form, {
                onUploadProgress:progress=>{
                    this.uploadProgress = Number(((progress.loaded/progress.total) * 100).toFixed(2))
                }
            })
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