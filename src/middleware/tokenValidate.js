const JWT = require("jsonwebtoken");
const { dbReader } = require("../models/dbconfig");

module.exports = async function tokenValidate(req, res, next) {
  try {
    if (req.headers.authorization) {
      let access_token = req.headers.authorization.toString().split(" ")[1];
      JWT.verify(access_token.toString(), "Permit_Check", async function(
        err,
        decoded
      ) {
        if (err) {
          throw new Error(err);
        } else {
          var user = await dbReader.users.findOne({
            where: {
              access_token: access_token.toString()
            }
          });
          if (user) {
            next();
          } else {
            throw new Error("session expired");
          }
        }
      });
    } else {
      res.send({
        status_code: 401,
        message: "Unauthorized request: no authorization given"
      });
    }
  } catch (err) {
    throw new Error(err);
  }
};
