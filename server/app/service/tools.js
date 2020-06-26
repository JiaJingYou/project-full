const {Service} = require('egg')
const path = require('path') 
const fse = require('fs-extra')

class ToolService extends Service{
    async mergeFile(filePath, hash, size){
        const chunkdir = path.resolve(this.config.UPLOAD_DIR, hash)
        let chunks = await fse.readdir(chunkdir)
        chunks.sort((a,b )=>{a.split('-')[1]-b.split('-')[1]})

        chunks = chunks.map(cp=>path.resolve(chunkdir, cp))
        await this.mergeChunks(chunks, filePath, size)
    }
    async mergeChunks(files, dest, size){
        const pipStream = (filePath, writeStream) => new Promise((resolve)=>{
            const readStream = fse.createReadStream(filePath)
            readStream.on('end',()=>{
                fse.unlinkSync(filePath)
                resolve()
            })
            readStream.pipe(writeStream)
        })

        await Promise.all(
            files.map((file, index) => {
                pipStream(file, fse.createWriteStream(dest,{
                    start: index*size,
                    end: (index+1)*size
                }))
            })
        )
    }
}
module.exports = ToolService