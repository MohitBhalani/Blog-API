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
            data: findData
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
            authorId: req.author
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


        if (String(findId.authorId) !== req.author) throw new Error("You are not the author of this blog")


        // console.log(findId)
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

        let data = await BLOG.findOneAndUpdate({ _id: req.params.id, authorId: req.author }, updatedData, { new: true });

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


        let data = await BLOG.findOneAndDelete({ _id: req.params.id, authorId: req.author })
        if (!data) throw new Error("Please Enter Valid ID! Unauthorised! You have Not Access To another Blog Delete")

        findId.image.map(el => fs.unlinkSync(`./public/blog-Images/${el}`))

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