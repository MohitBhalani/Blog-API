let mongoose = require('mongoose')
let Schema = mongoose.Schema

let authhorData = new Schema({
    name: {
        type: String,
        required: [true,"Please Enter a Author Name"],
    },
    email: {
        type: String,
        required: [true,"Please Enter a Email"],
        unique: true,
        // match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please Enter a valid Email Id'],
        trime: true
    },
    password: {
        type: String,
        required: [true,"Please Enter a Password"],
        // match: [/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,'Please Enter A Strong Password']
    },
    profile: {
        type: String,
        required: [true,"Please Enter a Profile"],
    }
})

let AUTHOR = mongoose.model('Author',authhorData)

module.exports = AUTHOR