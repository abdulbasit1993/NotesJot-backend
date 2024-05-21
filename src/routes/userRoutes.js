module.exports = function (app) {
  const userHandlers = require("../controllers/userController");

  app.route("/api/auth/register").post(userHandlers.registerUser);
  app.route("/api/auth/login").post(userHandlers.loginUser);
  app
    .route("/api/user/profile")
    .get(userHandlers.loginRequired, userHandlers.getUserProfile);
};
