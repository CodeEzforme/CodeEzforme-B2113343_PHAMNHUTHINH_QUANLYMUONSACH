const bookRoutes = require("./book.route");

module.exports = (app) => {  
  
  app.use("/books", bookRoutes);

}