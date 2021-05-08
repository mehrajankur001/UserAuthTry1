const mongoose = require('mongoose');
const { SECRET } = require('../config/index');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'super-admin', 'user']
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });



userSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this.id);
        const token = jwt.sign({
            user_id: this.id,
            role: this.role,
            username: this.username,
            email: this.email,
        }, SECRET);
        this.tokens = this.tokens.concat({ token })
        await this.save();
        console.log(token)
        console.log(this.tokens);
        return token;
    } catch (error) {
        res.send(`The error part ${error}`);
    }
}

module.exports = mongoose.model('users', userSchema)