    const Reader = require("../../models/DOCGIA.model");
    const Book = require('../../models/sach.model');
    const asyncHandler = require('express-async-handler');
    const generateString = require("../../helpers/generateString");

    const create = asyncHandler(async (req, res) => {
        try {
            req.body.token = generateString.generateRandomString(20);
            const user = await Reader.create(req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({
                massage: `Error! ${error}`
            });
        }
    })

    const getUser = asyncHandler(async (req, res) => {
        try {
            const tokenUser = req.headers.authorization.split(" ")[1];
            const reader = await Reader.findOne({
                token: tokenUser
            })
            res.status(200).json({
                message: "Send reader successfully.",
                reader
            });
        } catch (error) {
            res.status(500).json({
                massage: `Error! ${error}`
            });
        }
    })

    const statusBookReturn = async (req, res) => {
        try {
            const {
                readerId,
                bookId
            } = req.params;
            const {
                status
            } = req.body;

            const reader = await Reader.findById(readerId);
            if (!reader) {
                res.status(404).json({
                    message: "Reader not found."
                });
                return;
            }
            const bookIndex = reader.borrow.findIndex(book => book.id_book === bookId);
            if (bookIndex === -1) {
                res.status(404).json({
                    message: "Book not found."
                });
                return;
            }

            reader.borrow[bookIndex].status = status;

            await reader.save();

            res.status(200).json({
                message: "Status updated successfully."
            });
        } catch (error) {
            res.status(500);
            throw new Error(error.message)
        }
    };

    const deleteBookFromBorrow = asyncHandler(async (req, res) => {
        try {
            const tokenUser = req.cookies.tokenUser;
            const id = req.params.id;

            if (tokenUser) {
                const reader = await Reader.findOne({
                    token: tokenUser,
                })

                if (reader) {
                    reader.borrow = reader.borrow.filter(book => book.id_book !== id);

                    await reader.save();

                    res.status(200).json({
                        message: "Book deleted successfully."
                    });
                } else {
                    res.status(404).json({
                        message: "Reader not found."
                    });
                }

            } else {
                res.status(401).json({
                    message: "Unauthorized."
                });
            }
        } catch (error) {
            res.status(500).json({
                massage: `Error! ${error}`
            });
        }
    });

    const getInfor = asyncHandler(async (req, res) => {
        try {
            const token = req.cookies.tokenUser;
            const reader = await Reader.findOne({
                token: token,
            })
            res.status(200).json({
                message: 'Send employee successfully',
                reader
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }

    })

    const borrowBook = async (req, res) => {
        try {

            const tokenUser = req.cookies.tokenUser;

            if (tokenUser) {
                const reader = await Reader.findOne({
                    token: tokenUser
                });

                if (!reader) {
                    return res.status(404).json({
                        message: 'Reader not found'
                    });
                }

                if (!Array.isArray(reader.borrow)) {
                    reader.borrow = [];
                }

                const newBorrow = {
                    id_book: req.body.borrow.id_book,
                    status: req.body.borrow.status || "processing",
                    borrowDate: req.body.borrow.borrowDate || "01/01/2024",
                    returnDate: req.body.borrow.returnDate || "31/12/2024",
                    quantity: req.body.borrow.quantity || 1,
                };

                const readers = await Reader.find({});
                let borrowedBookQuantity = 0;

                readers.forEach(function (reader) {
                    reader.borrow.forEach(function (borrow) {
                        if (borrow.id_book === req.body.borrow.id_book) {
                            borrowedBookQuantity += borrow.quantity;
                        }
                    });
                });

                const book = await Book.findById(req.body.borrow.id_book);
                if (!book) {
                    return res.status(404).json({
                        message: 'Book not found'
                    });
                }


                if (book.quantity === 0) {
                    return res.status(400).json({
                        message: "No more books in stock to borrow"
                    });
                } else if (book.quantity - borrowedBookQuantity - newBorrow.quantity < 0) {
                    return res.status(400).json({
                        message: "The number of borrowed books has reached the limit"
                    });
                }

                const existingBook = reader.borrow.find(book => book.id_book === newBorrow.id_book);

                if (existingBook) {
                    existingBook.quantity += newBorrow.quantity;
                    existingBook.borrowDate = newBorrow.borrowDate || '01/01/2024';
                    existingBook.returnDate = newBorrow.returnDate || '31/12/2024';
                    existingBook.status = newBorrow.status || "processing";
                } else {
                    reader.borrow.push(newBorrow);
                }

                await reader.save();

                res.status(200).json({
                    message: 'Update book loans successfully',
                    reader
                });
            }
        } catch (error) {
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    const getNumberBookBorrowed = asyncHandler(async (req, res) => {
        try {
            const readers = await Reader.find({});
            let borrowedBookQuantity = 0;

            readers.forEach(function (reader) {
                reader.borrow.forEach(function (borrow) {
                    if (borrow.id_book === req.params.id_book) {
                        borrowedBookQuantity += borrow.quantity;
                    }
                });
            });

            res.status(200).json({
                message: 'Send NumberBookBorrowed successfully',
                borrowedBookQuantity
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }

    });

    module.exports = {
        create,
        getUser,
        getInfor,
        borrowBook,
        statusBookReturn,
        deleteBookFromBorrow,
        getNumberBookBorrowed
    }