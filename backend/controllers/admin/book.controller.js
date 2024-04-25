  const Book = require("../../models/sach.model");
  const ApiError = require('../../helpers/api-error');
  const asyncHandler = require("express-async-handler");
  const fs = require('fs');
  const upload = require('../../middlewares/admin/upload');
  const path = require('path')
  const fsx = require('fs-extra');

  const createBook = async (req, res) => {
    try {
      const book = await Book.create({
        ...req.body,
        thumbnail: req.file ? req.file.filename : null
      });
      res.status(200).json({
        message: 'Book added successfully',
        book
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  const getAll = async (req, res) => {
    try {
      const book = await Book.find({
        deleted: false
      });
      res.status(200).json(book);
    } catch (error) {
      res.status(500);
      throw new Error(error.message)
    }
  }

  const getOne = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)
      if (!book) {
        res.status(404).json({
          message: `Can not find book with ID: ${req.params.id}`
        })
      }
      res.status(200).json(book);
    } catch (error) {
      res.status(500);
      throw new Error(error.message)
    }
  }

  const updateOne = async (req, res) => {
    try {

      const bookId = req.params.id;
      const existingBook = await Book.findById(bookId);

      if (!existingBook) {
        return res.status(404).json({
          message: `Cannot find book with ID: ${bookId}`
        });
      }


      // Check if a new image file is uploaded
      if (req.file) {
        // Remove the old image file
        if (existingBook.thumbnail) {
          const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', existingBook.thumbnail);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Error deleting old image file: ${err}`);
            } else {
              console.log(`Old image file deleted: ${existingBook.thumbnail}`);
            }
          });
        }
      }

      const data = {
        ...req.body,
        thumbnail: req.file ? req.file.filename : existingBook.thumbnail
      };
      const book = await Book.findByIdAndUpdate(bookId, data, {
        new: true
      })
      if (!book) {
        res.status(404).json({
          message: `Can not find book with ID: ${req.params.id}`
        })
      }
      res.status(200).json({
        message: "Book was updated"
      });
    } catch (error) {
      res.status(500);
      throw new Error(error.message)
    }
  }


  const deleteOne = async (req, res) => {
    try {
      // const book = await Book.findByIdAndDelete(req.params.id, req.body)
      const currentDate = new Date().toISOString().substr(0, 10);
      const book = await Book.findByIdAndUpdate(req.params.id, {
        deleted: true,
        deletedAt: currentDate
      });
      if (!book) {
        res.status(404).json({
          message: `Can not find book with ID: ${req.params.id}`
        })
      }
      const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', book.thumbnail);

      if (book.thumbnail) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image file: ${err}`);
          } else {
            console.log(`Image file deleted: ${book.thumbnail}`);
          }
        });
      }
      res.status(200).json({
        message: `Book with ID: ${req.params.id} was deleted`
      });
    } catch (error) {
      res.status(500);
      // console.log("lôi");
      throw new Error(error.message)
    }
  }

  const deleteAll = async (req, res) => {
    try {
      const result = await Book.deleteMany({});
      // Đường dẫn đến thư mục "uploads"
      const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

      // Xóa thư mục "uploads" đệ quy
      await fsx.emptyDir(uploadDir);

      res.status(200).json({
        message: `Deleted ${result.deletedCount} books.`
      });
    } catch (error) {
      res.status(500);
      throw new Error(error.message)
    }
  }

  // // [POST] mượn sách
  // app.post('/borrow-book', async (req, res) => {
  //   try {
  //     const { id_reader, id_book, borrowDate, returnDate, quantity } = req.body;

  //     // Kiểm tra số lượng sách có sẵn để mượn
  //     const availableBooks = await Book.countDocuments({ _id: id_book, quantity: { $gte: quantity } });
  //     if (availableBooks < 1) {
  //       return res.status(400).json({ error: 'Sách không đủ để mượn' });
  //     }

  //     // Tạo một bản ghi mới trong BorrowedBook collection
  //     const borrowedBook = new BorrowedBook({
  //       id_reader,
  //       id_book,
  //       borrowDate,
  //       returnDate,
  //       quantity
  //     });

  //     // Lưu bản ghi vào cơ sở dữ liệu
  //     await borrowedBook.save();

  //     // Giảm số lượng sách trong kho sau khi mượn
  //     await Book.updateOne({ _id: id_book }, { $inc: { quantity: -quantity } });

  //     res.status(201).json({ message: 'Mượn sách thành công', borrowedBook });
  //   } catch (error) {
  //     console.error('Lỗi khi mượn sách:', error.message);
  //     res.status(500).json({ error: 'Đã xảy ra lỗi khi mượn sách' });
  //   }
  // });


  module.exports = {
    createBook,
    getAll,
    getOne,
    updateOne,
    deleteOne,
    deleteAll,
  }