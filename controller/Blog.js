let BLOG = require('../model/blog')
let path = require('path')
let fs = require('fs')


exports.blogRead = async (req, res, next) => {
    try {
        let findData;
        if (req.query.search) {
            findData = await BLOG.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { author: { $regex: req.query.search, $options: 'i' } },
                    { category: { $regex: req.query.search, $options: 'i' } }
                ]
            }).populate('authorId')
        } else {
            findData = await BLOG.find({ authorId: req.author }).populate('authorId');
        }

        res.status(200).json({
            status: 'success',
            message: "Blogs Read Are Succewsfully",
            data : findData
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.blogCreate = async (req, res, next) => {
    try {

        let { title, description, author, date, category } = req.body


        let data = await BLOG.create({
            title,
            description,
            image: req.files.map(el => el.filename),
            author,
            date,
            category,
            authorId : req.author
        })

        res.status(201).json({
            status: "SUCCESS",
            message: "Blog created successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.blogUpdate = async (req, res, next) => {
    try {
        // console.log("hello");

        // Find the blog by ID
        const findId = await BLOG.findById(req.params.id);
        if (!findId) throw new Error("Blog Not Found");

        // Handle file updates (image replacement)
        let updatedImage;
        if (req.files && req.files.length > 0) {

            findId.image.map(el => fs.unlinkSync(`./public/blog-Images/${el}`))
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

        const data = await BLOG.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        res.status(200).json({
            status: "SUCCESS",
            message: "Blog updated successfully",
            data,
        });
    } catch (error) {
        res.status(404).json({
            status: "FAIL",
            message: error.message,
        });
    }
};



exports.blogDelete = async (req, res, next) => {
    try {

        let findId = await BLOG.findById(req.params.id)
        if (!findId) throw new Error("Blog is Not Found");

        findId.image.map(el => fs.unlinkSync(`./public/blog-Images/${el}`))

        let data = await BLOG.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: "SUCCESS",
            message: "Blog deleted successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}