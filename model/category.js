let mongoose = require('mongoose')
let Schema = mongoose.Schema

let categoryData = new Schema({
    name: {
        type: String,
        required: [true,"Please Enter category name"]
    },
    description: {
        type: String,
        required: [true,"Plese Enter a Description of Categorys is Require"]
    },
    image: {
        type: [String],
        required: [true,"Please Enter a Image of Categorys is Require"]
    },
})

let CATEGORY = mongoose.model('Category', categoryData)

module.exports = CATEGORY