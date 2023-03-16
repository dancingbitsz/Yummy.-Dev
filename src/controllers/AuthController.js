const { dbReader, dbWriter } = require("../models/dbconfig")
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require("bcrypt");
const { ApiError, BadRequestError } = require("../core/ApiError");
const jwt_secret = "Permit_Check";
const saltRounds = 10;

class AuthController {

    // Get All Users...
    getUsers = async (req, res, next) => {
        try {

            let getUserData = await dbReader.users.findAll()
            getUserData = JSON.parse(JSON.stringify(getUserData))

            res.send({
                status_code: 200,
                message: "user data fetched successfully",
                data: getUserData ?? []

            })
        } catch (error) {
            ApiError.handleError(new BadRequestError(error.message) , res)
        }
    }

    // User Sign In...
    signIn = async (req, res, next) => {
        try {

            let { email, password } = req.body

            let getUser = await dbReader.users.findOne({
                where: { email , is_deleted : 0 }
            })

            const match = bcrypt.compareSync(password, getUser.password)
            if (match) {
                let data = {
                    user_id : getUser.user_id,
                    email:email
                }
                let access_token = JWT.sign(data , jwt_secret , {
                    expiresIn : '1d'
                })

                await dbWriter.users.update({
                    access_token
                },{
                    where : { email }
                })

                let getUserData = await dbWriter.users.findOne({
                    where : { email , is_deleted : 0 }
                })
                getUserData = JSON.parse(JSON.stringify(getUserData))
                res.send({
                    status_code: 200,
                    message: "user sign in successfully",
                    data: getUserData
                })
            } else {
                ApiError.handle(new BadRequestError("Invalid credentials") , res) 
            }

        } catch (error) {
            ApiError.handle(new BadRequestError(error.message) , res) 
        }
    }
    // User Sign Up...
    signUp = async (req, res, next) => {
        try {
            let { first_name, last_name, email, password } = req.body
            let getUser = await dbReader.users.findOne({
                where: { email , is_deleted:0 }
            })
            let unixTimestap = moment().unix()
            let created_datetime = JSON.stringify(unixTimestap),
            updated_datetime = JSON.stringify(unixTimestap)
            let user_id = uuidv4()

            let getCraetedUserData = {}
            if (getUser) {
                throw new Error("user already exists")
            } else {
                let data = { user_id , email }
                let access_token = JWT.sign(data , jwt_secret , {
                    expiresIn: '1d'
                })
                
                // encrypt password...
                const salt = bcrypt.genSaltSync(saltRounds)
                const hash = bcrypt.hashSync(password , salt)
                password = hash

                await dbWriter.users.create({
                    user_id,
                    first_name,
                    last_name,
                    email,
                    password,
                    access_token,
                    created_datetime,
                    updated_datetime
                })

                getCraetedUserData = await dbReader.users.findOne({
                    where : {email , is_deleted : 0}
                })
                getCraetedUserData = JSON.parse(JSON.stringify(getCraetedUserData))
            }

            res.send({
                status_code: 200,
                message: "user sign up successfully",
                data: getCraetedUserData ?? {}
            })
        } catch (error) {
            ApiError.handle(new BadRequestError(error.message) , res)
        }
    }

}

module.exports = AuthController