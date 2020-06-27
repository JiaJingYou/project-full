<template>
    <div>
        <h1>用户中心</h1>
        <div ref="drag" id="drag"> 
            <input type="file" name="file" @change="handleFileChange">
            <span>文件名称：{{file}}</span>
            </br>
            <span>可拖拽文件到此</span>
        </div>
        <div>
            <el-progress :stroke-width="26" :text-inside="true" :percentage="uploadProgress"></el-progress>
        </div>
        <div>
            <el-button @click="uploadFile"> 普通hash计算</el-button>
        </div>

         <div>
             <p>计算hash的进度</p>
            <el-progress :stroke-width="26" :text-inside="true" :percentage="hashProgress"></el-progress>
        </div>

        <div>
            <el-button @click="uploadSimpleFile"> 抽样hash计算</el-button>
        </div>
        <div>
             <p>抽样hash的进度</p>
            <el-progress :stroke-width="26" :text-inside="true" :percentage="simpleHashProgress"></el-progress>
        </div>

        <div>
            <el-button @click="uploadSimpleFile"> 上传切片</el-button>
        </div>
        <div>
             <p>上传进度</p>
            <div class="cube-container" :style="{width:cubeWidth+'px'}">
                <div class="cube" v-for="chunk in chunks" :key="chunk.name">
                   <div :class="{
                       'uploading': chunk.progress > 0 && chunk.progress < 100,
                       'success': chunk.progress == 100,
                       'error': chunk.progress < 0
                        }"
                        :style="{height:chunk.progress + '%'}"
                    >
                        <i class="el-icon-loading" style="color:#f56c6c" v-if="chunk.progress<100 &&  chunk.progress > 0"></i>
                    </div> 
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
#drag 
    height 200px
    line-height 100px
    border 2px dashed #eeeeee
    text-align center
.cube-container
    .cube
        width :14px
        height :14px
        line-height :12px
        border 1px black solid 
        background #eee
        float left
        >.success
            background green
        >.uploading
            background blue
        >.error
            background red
</style>
<script>
const CHUNK_SIZE = 1*1024*1024
import sparkMD5 from 'spark-md5'
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
            // uploadProgress: 0,
            hashProgress: 0,
            simpleHashProgress:0,
            chunks:[],
            uploaded: false,
            uploadedList: []
        }
    },
    computed:{
        cubeWidth(){
            return Math.ceil(Math.sqrt(this.chunks.length))*16
        },
        uploadProgress() {
            if(!this.file || this.chunks.length){
                return 0
            }

            const loaded = this.chunks.map(item=> item.chunk.size + item.progress)
                        .reduce((acc, cur)=>acc+cur, 0)
            return Number((loaded*100/this.file.size).toFixed(2))
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
        createFileChunk(file, size=CHUNK_SIZE) {
            const chunks = []
            let cur = 0
            while(cur < file.size){
                chunks.push({
                    index: cur,
                    file: file.slice(cur, cur+size)
                })
                cur+=size
            }
            return chunks
        },
        //抽样hash
        async createSimpleChunk(file) {
            // return new Promise(resolve => {
            //     const spark = new sparkMD5.ArrarBuffer()
                const reader = new FileReader()
                
                // const file = this.file
                const size = file.size
                const offset = CHUNK_SIZE
                //前中后各两个字节
                let chunks = [{index: cur,file:file.slice(0,offset)}]

                let cur = offset
                while (cur<size) {
                    if(cur+offset>= size){
                        chunks.push({index: cur,file: file.slice(cur, cur+offset)})
                    }else{
                        const mid = (cur+offset)/2
                        const end = cur+ offset
                        chunks.push({index: cur,file: file.slice(cur, cur+2)})
                        chunks.push({index: cur,file: file.slice(mid, mid+2)})
                        chunks.push({index: cur,file: file.slice(end-2, end)})
                    }
                    cur+=offset
                }
                return chunks
            //     reader.readAsArrayBuffer(new Blob(chunks))
            //     reader.onload = e => {
            //         spark.append(e.target.result)
            //         this.simpleHashProgress = 100
            //         resolve.end()
            //     }
            // })
        },
        async calculateHashWorker(chunks, flag) {
            return new Promise(resolve=>{
                let worker = new Worker('/hash.js')
                worker.postMessage({
                    chunks: chunks
                })
                worker.onmessage = e => {
                    const {progress, hash} = e.data
                    if(flag) {
                        this.simpleHashProgress = Number(progress.toFixed(2))
                    } else {
                        this.hashProgress = Number(progress.toFixed(2))
                    }   
                    
                    if(hash){
                        resolve(hash)
                    }
                }
            })
        },
        async dealChunks(chunks, hash) {
            this.chunks = chunks.map((chunk, index)=>{
                const name = hash + '_' + index
                return {
                    hash,
                    name,
                    index,
                    chunk: chunk.file,
                    progress:this.uploadedList.indexOf(name)<-1?100:0
                }
            })
            await this.uploadChunks()
        },
        async uploadSimpleFile(){
            const chunks1 = await this.createFileChunk(this.file)
            const hash1 = await this.calculateHashWorker(chunks1, true)
            this.hash = hash1
            //是否上传过，如果没有，是否有切片
            const {data} = await this.$http.post('api/checkfile', {
                hash: this.hash,
                ext: this.file.name.split('.').pop()
            }) 
            console.log(data);
               
            if(data.message.uploaded){
                return this.$message.success('秒传成功')
            }
            this.uploadedList = data.message.uploadedList

            if(hash1){
                await this.dealChunks(chunks1, hash1)
            }
            console.log('hash1', hash1);
        },
        async uploadFile(){
            // if(await this.isGif(this.file)) {
            //     alert('是GIF格式')
            // }
            // if(await this.isJPG(this.file)) {
            //     alert('是JPG格式')
            // }
            // if(await this.isPng(this.file)) {
            //     alert('是PNG格式')
            // }
            // return
            const chunks = await this.createFileChunk(this.file)
            const hash = await this.calculateHashWorker(chunks, false)
            // if(hash){
            //     this.dealChunks(chunks, hash)
            // }
            
            
            
        },
        async uploadChunks() {

            const requests = this.chunks
            .filter(chunk=>this.uploadedList.indexOf(chunk.name) == -1)
            .map((chunk, index)=>{
                const form = new FormData()
                form.append('chunk', chunk.chunk)
                form.append('hash', chunk.hash)
                form.append('name', chunk.name)
                return {form, index: chunk.index, error:0}
            })
            // .map(({form,index}) => this.$http.post('/api/uploadfile',form, {
            //    onUploadProgress:progress=>{
            //         this.chunks[index].progress = Number(((progress.loaded/progress.total) * 100).toFixed(2))
            //     }
            // }))
            // await Promise.all(requests)
            //并发请求数控制
            await this.sendRequest(requests)
            await this.mergeRequest()
            // const form = new FormData()
            // form.append('file', 'file')
            // form.append('name', this.file)
            // const ret = await this.$http.post('/api/uploadfile', form, {
            //     onUploadProgress:progress=>{
            //         this.uploadProgress = Number(((progress.loaded/progress.total) * 100).toFixed(2))
            //     }
            // })
        },
        async sendRequest(requests, limit=4){
            return new Promise((resolve, reject)=>{
                const len = requests.length
                let count = 0
                let isStop = false;
                const start = async () => {
                    if(isStop){
                        return
                    }
                    const task = requests.shift()
                    if(task){
                        const {form, index} = task
                        try {
                            await this.$http.post('/api/uploadfile',form, {
                                onUploadProgress:progress=>{
                                    this.chunks[index].progress = Number(((progress.loaded/progress.total) * 100).toFixed(2))
                                }
                            })
                            if(count == len-1){
                                resolve()
                            } else {
                                count++
                                start()
                            }
                        } catch (e) {
                            this.chunks[index].progress = -1
                            if(task.error<3){
                                requests.unshift(task)
                                start()
                            } else {
                                isStop = true
                                reject()
                            }
                        }
                        
                    }
                    
                }


                while(limit>0){
                    start()
                    limit-=1
                }

            })
        },
        async mergeRequest(){
            this.$http.post('/api/mergefile', {
                ext: this.file.name.split('.').pop(),
                size: CHUNK_SIZE,
                hash: this.hash
            })
        },
        handleFileChange(e){
            const [file] = e.target.files
            if(!file) return
            this.file = file;
        }
    }
}
</script>