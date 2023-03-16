const AuthController = require('../../controllers/authController');
const validator = require("../../helpers/validator");
const ValidationSource = require("../../helpers/validator");
const tokenValidate = require('../../middleware/tokenValidate');
const { jois } = require('./schema');

class AuthRoute extends AuthController {
    constructor(router) {
        super();
        this.route(router);
    }
    route(router) {
        router.get("/getUsers", this.getUsers);
        router.post("/registration", validator(jois.registrationPayload),this.registration);
        router.post("/login", validator(jois.loginPayload),this.login);
    }
}

module.exports = AuthRoute