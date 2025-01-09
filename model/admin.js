let mongoose = require('mongoose')
let Schema = mongoose.Schema

let adminData = new Schema({
    name: {
        type: String,
        required: [true,'Please Enter Admin name'],
    },
    number: {
        type: Number,
        required: [true,'please Enter Number'],
        unique: true,
        trime: true
    },
    email: {
        type: String,
        required: [true,'Please Enter Admin Email'],
        // match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please Enter a valid Email Id'],
        unique: true,
        trime: true
    },
    password: {
        type: String,
        required: [true,'Please Enter Admin Password'],
        // match: [/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,'Please Enter A Strong Password']
    }
})

let ADMIN = mongoose.model('Adminlogin',adminData)

module.exports = ADMIN