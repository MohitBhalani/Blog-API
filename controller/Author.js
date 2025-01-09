let AUTHOR = require('../model/author')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let bcrypt = require('bcrypt')

exports.Secure = async (req, res, next) => {
    try {

        // console.log("hello");

        const token = req.headers.authorization   //  token check for any token not valid token can not to be submitted
        if (!token) throw new Error('Author Token is Not Valid')

        const isvalidtoken = jwt.verify(token, "Author")  //  original token can only verify
        console.log(isvalidtoken);

        req.author = isvalidtoken.id
        
        const isAuthor = await AUTHOR.findById(isvalidtoken.id)  //  check for Autor can Blog update, delete and read in database(mongodb)  // id can check only pass in Authorrouter router

        if (!isAuthor) throw new Error('Author Data are Not Avalable in Database')  // if user can logout when not login with token 

        next()
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}

exports.authorRead = async (req, res, next) => {
    try {

        let data = await AUTHOR.find()

        res.status(200).json({
            status: "SUCCESS",
            message: "Author Read Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}

exports.authorSignup = async (req, res, next) => {
    try {
        let { name, email, password } = req.body

        req.body.password = await bcrypt.hash(password, 10)
        password = req.body.password

        if (!req.file) throw new Error('Profile is Require! Please Enter a Profile')


        let check = await AUTHOR.findOne({ email: email })
        if (check) throw new Error('Try Another Email! this Email is all Ready Exists!')

        let data = await AUTHOR.create({
            name,
            email,
            password,
            profile: req.file.filename
        })

        res.status(201).json({
            status: "SUCCESS",
            message: "Author Signed Up Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.authorLogin = async (req, res, next) => {
    try {

        let { email, password } = req.body
        

        let findEmail = await AUTHOR.findOne({ email })
        if (!findEmail) throw new Error('Email Not Found')

        let findPassword = await bcrypt.compare(password, findEmail.password)
        if (!findPassword) throw new Error('Password Not Found')

        let token = jwt.sign({ id: findEmail._id }, "Author")

        res.status(200).json({
            status: "SUCCESS",
            message: "Author Login Successfully",
            data: findEmail,
            token
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.authorUpdate = async (req, res, next) => {
    try {
        // console.log("++++");

        let findId = await AUTHOR.findById(req.params.id)
        if (!findId) throw new Error('Author Not Found')

            if (req.file) {
                const oldImagePath = `./public/author-profile/${findId.profile}`;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image
                }
            }
    
            // Update the author with the new data
            const updatedData = {
                ...req.body,
                profile: req.file ? req.file.filename : findId.profile, // Update profile only if a new file is uploaded
            };

        // console.log(req.body);

        let data = await AUTHOR.findByIdAndUpdate(req.params.id, updatedData, { new: true })


        res.status(200).json({
            status: "SUCCESS",
            message: "Author Updated Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.authorDelete = async (req, res, next) => {
    try {

        let findId = await AUTHOR.findById(req.params.id)
        if (!findId) throw new Error('Author is Already Exists')

        // fs.unlinkSync(`./public/author-profile/${findId.profile}`)
        if (findId.profile) {
            const imagePath = `./public/author-profile/${findId.profile}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath ); // Delete the image
            }
        }
        let data = await AUTHOR.findByIdAndDelete(req.params.id)


        res.status(200).json({
            status: "SUCCESS",
            message: "Author Deleted Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


// exports.authorDelete = async (req, res, next) => {
//     try {

//         let findId = await AUTHOR.findById(req.params.id)
//         if (!findId) throw new Error('Author is Already Exists')

//         // fs.unlinkSync(`./public/author-profile/${findId.profile}`)
//         if (findId.profile) fs.unlinkSync(`./public/author-profile/${findId.profile}`);

//         let data = await AUTHOR.findByIdAndDelete(req.params.id)


//         res.status(200).json({
//             status: "SUCCESS",
//             message: "Author Deleted Successfully",
//             data
//         })
//     } catch (error) {
//         res.status(404).json({
//             status: "Fail",
//             message: error.message
//         })
//     }
// }