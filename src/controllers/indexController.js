const { response } = require("express");

class indexController {
    getHomePage(req, res) {
        res.send("This is Home Page")
    }
}

module.exports = indexController