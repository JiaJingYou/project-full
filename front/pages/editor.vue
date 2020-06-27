<template>
    <div> 
        <div class="write-btn">
            <el-button @click="submit" type='primary'>提交</el-button>
        </div>
        <el-row>
            <el-col :span='12'>
                <textarea class="md-editor" :value="content" @input="update"
                    cols="30" rows="40" ref="editor"></textarea>
            </el-col>
            <el-col :span='12'>
                <div class="markdown-body" v-html="compiledContent"></div>
            </el-col>
        </el-row>    
    </div>
    
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'
export default {
    data(){
        return{
            content:`吃饭  
## 睡觉  
### 写代码

\`\`\`javascript 
let code = 1;
console.log(code)
\`\`\`
`
        }
    },
    mounted(){
        this.timer = null
        this.bindEvents()

        marked.setOptions({
            rendered: new marked.Renderer(),
            highlight(code){
                return hljs.highlightAuto(code).value
            } 
        })
    },
    computed:{
        compiledContent() {
            return marked(this.content, {})
        }
    },
    methods:{
        bindEvents() {
            this.$refs.editor.addEventListener('paste', async e=>{
                const files = e.clipboardData.files
                
            })
           this.$refs.editor.addEventListener('drop', async e=>{
                const files = e.dataTransfer.files
                
                e.preventDefault()
            })
        },
        update(e){
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.content = e.target.value
            },350)
            
        },
        submit() {

        }
    }
}
</script>
<style scoped>
    .md-editor{
        width: 100%;
        height: 100%;
        outline: none;
    }
    .write-btn{
        position: fixed;
        z-index: 100;
        right: 30px;
        top: 10px;
    }
</style>