    const mongoose = require('mongoose')
    const slug = require('mongoose-slug-updater');
    mongoose.plugin(slug);

    const borrowedBookSchema = new mongoose.Schema({
        id_reader: String,
        id_book: String,
        borrowDate: String,
        returnDate: String,
        quantity: {
            type: Number,
            required: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    }, {
        timestamps: true
    })

    const BorrowedBook = mongoose.model("BorrowedBook", borrowedBookSchema, "THEODOIMUONSACH");

    module.exports = BorrowedBook;