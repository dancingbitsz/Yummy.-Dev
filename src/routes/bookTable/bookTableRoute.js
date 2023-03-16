const BookTableController = require('../../controllers/bookTableController');
const validator = require("../../helpers/validator");
const ValidationSource = require("../../helpers/validator");
const tokenValidate = require('../../middleware/tokenValidate');
const { jois } = require('./schema');

class BookTableRoute extends BookTableController {
    constructor(router) {
        super();
        this.route(router);
    }
    route(router) {
        router.post("/bookTable", tokenValidate, validator(jois.bookTablePayload),this.bookTable);
    }
}

module.exports = BookTableRoute