var express = require('express');
var router = express.Router();
let multer = require('multer')


let blogController = require('../controller/Blog')
let authorController = require('../controller/Author')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/blog-images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + "." +file.originalname.split('.').pop())
  }
})

const upload = multer({ storage: storage })


router.get('/read',authorController.Secure ,blogController.blogRead);

router.post('/create', authorController.Secure ,upload.array('image', 2) ,blogController.blogCreate);

router.patch('/update/:id',authorController.Secure ,upload.array('image', 2), blogController.blogUpdate)

router.delete('/delete/:id',authorController.Secure ,blogController.blogDelete)

module.exports = router;