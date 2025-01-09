var express = require('express');
var router = express.Router();
let multer = require('multer')

let authorController = require('../controller/Author')
let AdminController = require('../controller/Admin')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/author-profile')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + "." +file.originalname.split('.').pop())
  }
})

const upload = multer({ storage: storage })



/* GET users listing. */
router.get('/read', AdminController.Secure ,authorController.authorRead);

router.post('/signup', upload.single('profile'), authorController.authorSignup);

router.post('/login',authorController.authorLogin);

router.patch('/update/:id',upload.single('profile'), authorController.authorUpdate);

router.delete('/delete/:id',AdminController.Secure ,authorController.authorDelete)

module.exports = router;
