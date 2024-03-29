const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/env");

const UserModel = require("../model/user.model");

const { compareHash } = require("../utils/hashProvider");

const login = async (request, response) => {
  const { email, password } = request.body;

  const user = await UserModel.findOne({ email }).lean();

  const loginErrorMessage = {
    error: "@authenticate/login",
    messagem: "Invalid user or password",
  };

  if (!user) {
    return response.status(400).json(loginErrorMessage);
  }

  const isValidPassword = await compareHash(password, user.password);

  if (!isValidPassword) {
    return response.status(400).json(loginErrorMessage);
  }

  const token = jwt.sign(user, JWT_SECRET, {
    expiresIn: "1h",
  });
  delete user.password;

  return response.send({ ...user, token });
};

module.exports = {
  login,
};
