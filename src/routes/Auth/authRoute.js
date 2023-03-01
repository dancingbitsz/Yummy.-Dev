const AuthController = require("../../controllers/AuthController");
const tokenValidate = require("../../middleware/tokenValidate");
const validator = require("../../helpers/validator");
const { jois } = require("./schema");

class AuthRoute extends AuthController {
  constructor(router) {
    super();
    this.route(router);
  }

  route(router) {
    router.get("/getUsers", tokenValidate, this.getUsers);
    router.post("/signIn", validator(jois.signInPayload), this.signIn);
    router.post("/signUp", validator(jois.signUpPayload), this.signUp);
  }
}

module.exports = AuthRoute;
