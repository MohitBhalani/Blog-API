let CATEGORY = require('../model/category')
let fs = require('fs')
let path = require('path')


exports.categoryRead = async (req, res, next) => {
    try {
        let data = await CATEGORY.find()

        res.status(200).json({
            status: "SUCCESS",
            message: "Category List",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.categoryCreate = async (req, res, next) => {
    try {
        let { name, description } = req.body

        if (!req.files || req.files.length === 0) throw new Error('Please Enter A Minimam : 1 Images and Maximum : 3 Images')


        let data = await CATEGORY.create({
            name,
            description,
            image: req.files.map(el => el.filename)
        })

        res.status(201).json({
            status: "SUCCESS",
            message: "Category Create Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.categoryUpdate = async (req, res, next) => {
    try {

        let findId = await CATEGORY.findById(req.params.id)
        if (!findId) throw new Error('Category Not Found')

        let updatedImage;
        if (req.files && req.files.length > 0) {

            findId.image.map(el => fs.unlinkSync(`./public/category-images/${el}`))
            // Store the new image(s)
            updatedImage = req.files.map(file => file.filename);

        } else {
            // Keep the old image if no new file is uploaded
            updatedImage = findId.image;
        }

        // Update the blog with new data
        const updatedData = {
            ...req.body,
            image: updatedImage,
        };

        let data = await CATEGORY.findByIdAndUpdate(req.params.id, updatedData, { new: true })

        res.status(200).json({
            status: "SUCCESS",
            message: "Category Update Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.categoryDelete = async (req, res, next) => {
    try {
        let findId = await CATEGORY.findById(req.params.id)
        if (!findId) throw new Error('Category Not Found')

        findId.image.map(el => fs.unlinkSync(`./public/category-images/${el}`))

        let data = await CATEGORY.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: "SUCCESS",
            message: "Category Delete Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}
