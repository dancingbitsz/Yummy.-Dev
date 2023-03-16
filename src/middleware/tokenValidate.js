const { Response, Request, NextFunction } = require ("express");
const jwt = require('jsonwebtoken');
const { dbReader, dbWriter } = require('../models/dbconfig');
const { SuccessResponse, AuthFailureError, BadRequestError, ApiError } = require('../core/index');

module.exports = async function tokenValidate(req, res, next) {
    try {
        if(req.headers.authorization){
            // let access_token = req.headers.authorization;
            let access_token = req.headers.authorization.toString().split(" ")[1];
            jwt.verify(access_token.toString(), "Permit_Check",async function (err, decoded){
                if(err){
                    ApiError.handle(new AuthFailureError("Invalid token."), res);
                } else {
                    var user = await dbReader.users.findOne({
                        where: { access_token : access_token.toString() },
                    });
                    if(user){
                        next();
                    } else {
                        ApiError.handle(new AuthFailureError("Your session is expired. Please login into system again."), res);
                        // res.send({
                        //     status_code: 401,
                        //     message: "Your session is expired. Please login into system again."
                        // }); 
                    }
                }
            });
        } else {
            res.send({
                status_code: 401,
                message: "Unauthorized request: no authentication given"
            }); 
        }
    } catch(err){
        ApiError.handle(new AuthFailureError(err.message), res);
    }        
}
