const Employee = require('../../models/NhanVien.model');
const Reader = require('../../models/DOCGIA.model');

const getInfor = async (req, res) => {
    try {
        const token = req.cookies.token;
        const employee = await Employee.findOne({
            token: token
        })

        res.status(200).json({
            message: 'Send employee successfully',
            employee
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

const getReaders = async (req, res) => {
    try {
        const readers = await Reader.find({});

        res.status(200).json(readers);
    } catch (error) {
        res.status(500);

        throw new Error(error.message)
    }
}

const statusBook = async (req, res) => {
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
}

module.exports = {
    getInfor,
    getReaders,
    statusBook
}