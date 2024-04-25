const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/reader.controller");
// const authMiddleware = require("../../middlewares/client/auth.middleware");

router.post('/register', controller.create)

router.get('/user', controller.getUser)

router.get('/infor', controller.getInfor)

router.put('/borrow', controller.borrowBook)

router.put('/statusBookReturn/:readerId/:bookId', controller.statusBookReturn)

router.delete('/return/:id', controller.deleteBookFromBorrow)

router.get('/numberbookborrowed/:id_book', controller.getNumberBookBorrowed)
module.exports = router;