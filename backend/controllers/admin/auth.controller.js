const bcrypt = require('bcrypt');
const Account = require('../../models/NhanVien.model');
const ApiError = require('../../helpers/api-error');

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res, next) => {
  try {
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    const user = await Account.findOne({
      email: enteredEmail
    });

    if (!user) {
      res.json('wrong info');
      return;
    }

    if (!enteredPassword) {
      res.json('wrong info');
      return;
    }

    if (enteredPassword != user.password) {
      res.json('wrong info');
      return;
    }

    res.cookie("token", user.token);
    res.json('success');

  } catch (error) {
    console.log('error:', error);
    return next(new ApiError(500, error));
  }

};


// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.send({
    success: true
  })
}