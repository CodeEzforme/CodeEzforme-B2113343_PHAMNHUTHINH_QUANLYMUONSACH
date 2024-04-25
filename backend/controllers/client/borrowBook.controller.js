  const Book = require("../../models/sach.model");
  const borrowedBook = require("../../models/THEODOIMUONSACH.model");

  // [GET] /books
  const getAll = async (req, res) => {
    try {
      const book = await Book.find({});
      res.status(200).json(book);
    } catch (error) {
      res.status(500);
      throw new Error(error.message)
    }
  }
  const borrowBook = async (req, res) => {
    try {
      const {
        id_reader,
        id_book,
        borrowDate,
        returnDate,
        quantity
      } = req.body;

      // Kiểm tra số lượng sách có sẵn để mượn
      const availableBooks = await Book.countDocuments({
        _id: id_book,
        quantity: {
          $gte: quantity
        }
      });
      if (availableBooks < 1) {
        return res.status(400).json({
          error: 'Sách không đủ để mượn'
        });
      }

      // Tạo một bản ghi mới trong BorrowedBook collection
      const borrowedBook = new BorrowedBook({
        id_reader,
        id_book,
        borrowDate,
        returnDate,
        quantity
      });

      // Lưu bản ghi vào cơ sở dữ liệu
      await borrowedBook.save();

      // Giảm số lượng sách trong kho sau khi mượn
      await Book.updateOne({
        _id: id_book
      }, {
        $inc: {
          quantity: -quantity
        }
      });

      res.status(201).json({
        message: 'Mượn sách thành công',
        borrowedBook
      });
    } catch (error) {
      console.error('Lỗi khi mượn sách:', error.message);
      res.status(500).json({
        error: 'Đã xảy ra lỗi khi mượn sách'
      });
    }
  };

  module.exports = {
    getAll,
    borrowBook,
  }