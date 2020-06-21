
module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema


    const UserSchema  = new Schema({
        email: {type:String, require: true},
        passwd: {type:String, require: true},
        nickname: {type:String, require: true},
        avatar: {type:String, require: false, default: 'user/png'},
    },{
        timestamps:true
    })
    return mongoose.model('User', UserSchema)
}