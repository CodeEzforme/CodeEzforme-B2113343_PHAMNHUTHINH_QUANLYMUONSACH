const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/borrowBook.controller");


router.get('/',controller.borrowBook)
// router.get('/', controller.getAll)
// router.get('/:id', controller.getOne)
// router.put('/:id',upload.single('thumbnail'), controller.updateOne)
// router.delete('/:id', controller.deleteOne)
// router.delete('/', controller.deleteAll)
// router.get('/:id/borrow-book', controller.)


module.exports = router