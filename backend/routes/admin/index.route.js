    const configSystem = require("../../config/system")

    const bookRouter = require('./book.route');
    const authRouter = require('./auth.route');
    const employeeRouter = require('./employee.route');
    const authMiddleware = require("../../middlewares/admin/auth.middleware");
    const borrowBookRouter = require('../client/borrowbook.route');

    module.exports = (app) => {
      const ADMIN_PATH = '/' + configSystem.adminPrefix;
      app.use(
        ADMIN_PATH + "/books",
        authMiddleware.authRequire,
        bookRouter
      );
      app.use(
        ADMIN_PATH + "/auth",
        authRouter
      );
      app.use(
        ADMIN_PATH + "/borrow-book",
        borrowBookRouter
      );
      app.use(
        ADMIN_PATH + "/employee",
        employeeRouter
      );
    }