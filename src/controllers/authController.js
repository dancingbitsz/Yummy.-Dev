const { NextFunction, Request, response } = require('express');
const { SuccessResponse, BadRequestError, ApiError } = require('../core/index');
const { dbReader, dbWriter } = require('../models/dbconfig');
const { Op } = dbReader.Sequelize;
const { JWT, createJwt } = require('../core/JWT');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY
const request = require('request');
const moment = require('moment');
const axios = require('axios');

require('dotenv').config()

class AuthController {

    // getUsers...
    getUsers = async (req, res) => {
        try {

            let userData = await dbReader.users.findAll()

            res.send({
                status_code: 200,
                message: "user fetched successfully",
                data: userData ?? []
            });
        } catch (error) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    //Create new user into database
    registration = async (req, res) => {
        try {
            let { first_name, last_name, email, password } = req.body
            var unixTimestamp = Math.floor(new Date().getTime() / 1000);
            let created_datetime = JSON.stringify(unixTimestamp),
                updated_datetime = JSON.stringify(unixTimestamp);
            let data

            let checkUser = await dbReader.users.findOne({
                where: {
                    email, is_deleted: 0
                }
            })

            if (!_.isEmpty(checkUser)) {
                throw new Error("User already Exist")
            } else {
                let user_id = uuidv4()
                let tokenData = {
                    user_id, email
                }
                // * access token and password hashing...
                let access_token = jwt.sign(tokenData, SECRET_KEY)
                const salt = bcrypt.genSaltSync(saltRounds)
                const hash = bcrypt.hashSync(password, salt)
                password = hash

                let createUser = dbWriter.users.create({
                    user_id, first_name, last_name, email, password, access_token, created_datetime, updated_datetime
                })
                if (createUser) {
                    data = await dbReader.users.findOne({
                        where: { user_id }
                    })
                    data = JSON.parse(JSON.stringify(data))
                }
            }

            res.send({
                status_code: 200,
                message: "register successfully",
                data: data ?? {}
            });

        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    //Login user
    login = async (req, res) => {
        try {

            let { email, password } = req.body

            let getUsers = await dbReader.users.findOne({
                where: {
                    email, is_deleted: 0
                }
            })
            let data
            if (getUsers) {
                getUsers = JSON.parse(JSON.stringify(getUsers))
                // ? check password...
                let match = await bcrypt.compare(password, getUsers.password)
                if (match) {
                    let tokenData = { email, user_id: getUsers.user_id }
                    let access_token = jwt.sign(tokenData, SECRET_KEY);
                    await dbWriter.users.update({
                        access_token: access_token,
                        updated_datetime: moment().unix()
                    }, {
                        where: {
                            email: email
                        }
                    })
                    data = await dbReader.users.findOne({
                        attributes: { exclude: ['password', 'is_deleted', 'created_datetime', 'updated_datetime'] },
                        where: {
                            email, is_deleted: 0
                        }
                    })
                    // data = updateUser
                    data = JSON.parse(JSON.stringify(data))
                } else {
                    throw new Error("Invalid email")
                }
            }

            res.send({
                status_code: 200,
                message: "login successfully",
                data: data ?? {}
            });
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    // log out...
    logOut = async (req, res) => {
        try {
            let user_id = req.user_id ?? 0
            await dbWriter.users.update({
                access_token: ""
            }, { where: { user_id } })

            res.send({
                status_code: 200,
                message: "Log out",
            });
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    // contact us...
    contactUs = async (req, res) => {
        try {

            let { email, name, subject, message } = req.body
            let user_id = req.user_id ?? 0
            var unixTimestamp = Math.floor(new Date().getTime() / 1000);
            let created_datetime = JSON.stringify(unixTimestamp),
                updated_datetime = JSON.stringify(unixTimestamp);

            let data = await dbWriter.contactUs.create({
                contact_us_id: uuidv4(), user_id,
                email, name, subject, message, created_datetime, updated_datetime
            })

            res.send({
                status_code: 200,
                message: "Thank you",
                data: data ?? {}
            });
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

    // User Profile...
    getMyProfile = async (req, res) => {
        try {
            console.log(req.user_id);
            let profileData = await dbReader.users.findOne({
                attributes: { exclude: ['password', 'access_token', 'is_deleted', 'created_datetime', 'updated_datetime'] },
                include: [{
                    model: dbReader.userBookingTable,
                    attributes: ['book_table_id', 'name', 'email', 'phone', 'booking_date', 'booking_time', 'people', 'message'],
                    where: {
                        is_deleted: 0
                    }
                }],
                where: {
                    user_id: req.user_id,
                    is_deleted: 0
                }
            })
            profileData = JSON.parse(JSON.stringify(profileData))
            res.send({
                status_code: 200,
                message: "user fetched successfully",
                data: profileData ?? {}
            });
        } catch (error) {
            ApiError.handle(new BadRequestError(error.message), res);
        }
    }

}

module.exports = AuthController;