const mongoose = require('mongoose');
const { ImageSchema } = require('./image')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        trim: true, 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {type: String, required: true, minlength: 2},
    lastName: {type: String, required: true, minlength: 1},
    profilePicture: ImageSchema,
    bio: {type: String},
    followers: [mongoose.Schema.Types.ObjectId],
    following: [mongoose.Schema.Types.ObjectId],
    statistics: [mongoose.Schema.Types.ObjectId],
    isAdmin: {type: Boolean, required: true}
})

UserSchema.statics.findByUsernamePassword = function(username, password) {
    const User = this;

    return User.findOne({username: username}).then(user => {
        if(!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            if(user.password === password){
                resolve(user)
            } else {
                reject()
            }
        })
    })
}

UserSchema.statics.findByUsername = function(username) {
    const User = this;
    return User.findOne({username: username})
}

const User = mongoose.model('User', UserSchema);

module.exports = { User }