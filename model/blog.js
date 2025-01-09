let mongoose = require('mongoose')
let Schema = mongoose.Schema

let blogData = new Schema({

    title: {
        type: String,
        required: [true,'Title is Require! Please Enter Title']
    },
    description: {
        type: String,
        required: [true,'Description is Require! Please Enter Description']
    },
    image: {
        type: [String],
        required: [true,'Image is Require! Please Enter Image']
    },
    author: {
        type: String,
        required: [true,'Author is Require! Please Enter Author']
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: [true,'Category is Require! Please Enter Category']
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
})

let BLOG = mongoose.model('blog',blogData)

module.exports = BLOG