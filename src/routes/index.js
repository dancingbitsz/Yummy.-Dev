const indexController = require("../controllers/indexController") 

class indexRoute extends indexController {
  constructor(router) {
    super()
    this.route(router)
  }

  route(router) {
    router.get("/index" , this.getHomePage)
  }

}

module.exports = indexRoute;