const { response } = require("express");

class indexController {
  checkHost(req, res) {
    res.send("Host is working");
  }
}

module.exports = indexController;
