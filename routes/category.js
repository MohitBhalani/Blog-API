var express = require('express');
var router = express.Router();
let categoryController = require('../controller/Category')
let adminController = require('../controller/Admin')
let multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/category-Images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/read',categoryController.categoryRead);

router.post('/creat', adminController.Secure ,upload.array('image', 3),categoryController.categoryCreate);

router.patch('/update/:id', adminController.Secure ,upload.array('image', 3),categoryController.categoryUpdate);

router.delete('/delete/:id', adminController.Secure ,categoryController.categoryDelete);

module.exports = router;