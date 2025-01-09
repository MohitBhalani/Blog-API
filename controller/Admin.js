let ADMIN = require('../model/admin')
let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')

exports.Secure = async (req, res, next) => {
    try {

        console.log("hello");

        const token = req.headers.authorization   //  token check for any token not valid token can not to be submitted
        if (!token) throw new Error('Admin Token is Not Valid')

        const isvalidtoken = jwt.verify(token, "Admin")  //  original token can only verify
        console.log(isvalidtoken);

        const isadmin = await ADMIN.findById(isvalidtoken.id)  //  check for Admin can AuthorData update, delete and read in database(mongodb)  // id can check only pass in Author router

        if (!isadmin) throw new Error('ADMIN Data are Not Avalable in Database! New Token is Messing')  // if user can logout when not login with token 

        next()
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.adminRead = async (req, res, next) => {
    try {

        let data = await ADMIN.find()

        res.status(200).json({
            status: "SUCCESS",
            message: "Admin Read are Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: message.error
        })
    }
}

exports.adminSignup = async (req, res, next) => {
    try {

        let { name, number, email, password } = req.body

        req.body.password = await bcrypt.hash(password, 10)
        password = req.body.password

        let check = await ADMIN.findOne({ email: email })
        if (check) throw new Error('This Email Already Exist! Try Another Email!')

        let data = await ADMIN.create({
            name,
            number,
            email,
            password
        })

        res.status(201).json({
            statuss: "SUCCESS",
            message: "Admin created successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}

exports.adminLogin = async (req, res, next) => {
    try {

        let { email, password } = req.body

        let findEmail = await ADMIN.findOne({ email })
        if (!findEmail) throw new Error('Please Enter Valid Email! Email is Wrong!')

        let findPassword = await bcrypt.compare(password, findEmail.password)
        if (!findPassword) throw new Error('Please Enater Valid Password! Password is Wrong!')

        let token = jwt.sign({ id: findEmail._id }, "Admin")

        res.status(200).json({
            status: "SUCCESS",
            message: "Admin Login Successfuly",
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