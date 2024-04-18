    const bookRoutes = require("./book.route");
    const readerRoutes = require("./reader.route");
    const authRoutes = require("./auth.route");
    const borrowBookRouter = require('../client/borrowbook.route');

    const authMiddleware = require("../../middlewares/client/auth.middleware");
    const controllerReader = require("../../controllers/client/reader.controller");

    module.exports = (app) => {

    app.use("/books", authMiddleware.authRequire, bookRoutes);

    app.post('/reader/register', controllerReader.create)

    app.use("/reader",authMiddleware.authRequire, readerRoutes);

    app.use("/auth", authRoutes);

    app.use("/borrow-book", borrowBookRouter);
    }