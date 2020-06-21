<template>
    <div>
        <h1>用户中心</h1>
        <div ref="drag" id="drag"> 
            <input type="file" name="file" @change="handleFileChange">
        </div>
        <div>
            <el-progress :text-inside="true" :percentage="uploadProgress"></el-progress>
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
import { resolve } from 'url';
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
        async blobToString(blob){
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.onload = function(){
                    const ret = reader.result.split('')
                                .map(v=>v.charCodeAt()) //装换ANSI
                                .map(v=>v.toString(16).toUpperCase()) //装换16进制
                                .join('')
                    resolve(ret)
                }
                reader.readAsBinaryString(blob)
            })
        },
        async isGif(file){
            // 47 49 46 38 39 61 or 47 49 46 38 37 61
            const ret = await this.blobToString(file.slice(0, 6))
            const isGif = (ret === '47 49 46 38 39 61') || (ret === '47 49 46 38 37 61')
            return isGif
        },
        async isPng(file){
            // 89 50 4E 47 0D 0A 1A 0A
            const ret = await this.blobToString(file.slice(0, 8))
            const isPng = ret === '89 50 4E 47 0D 0A 1A 0A'
            return isPng
        },
        async isJPG(file){
            // 89 50 4E 47 0D 0A 1A 0A
            const start = await this.blobToString(file.slice(0, 2))
            const end = await this.blobToString(file.slice(-2, file.size))
            const isJPG = (start === 'FF D8') && (end === 'FF D9')
            return isJPG
        },
        async isImage(file){
            return this.isGif(file)
        },
        async uploadFile(){
            if(await this.isGif(this.file)) {
                alert('是GIF格式')
            }
            if(await this.isJPG(this.file)) {
                alert('是JPG格式')
            }
            if(await this.isPng(this.file)) {
                alert('是PNG格式')
            }
            return
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