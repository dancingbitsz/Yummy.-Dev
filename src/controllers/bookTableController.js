
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

class BookTableController {

    // Book Table...
    bookTable = async (req, res) => {
        try {
            let { name, email, phone, bookingDate, bookingTime, people, message } = req.body
            let user_id = req.user_id
 
            var unixTimestamp = Math.floor(new Date().getTime() / 1000);
            let created_datetime = JSON.stringify(unixTimestamp),
                updated_datetime = JSON.stringify(unixTimestamp);

            let userBookTable = await dbReader.userBookingTable.create({
                book_table_id: uuidv4(), user_id, booking_date : bookingDate, booking_time : bookingTime,
                name, email, phone, people, message, created_datetime, updated_datetime
            })

            res.send({
                status_code: 200,
                message: "table booked successfully",
                data: userBookTable ?? {}
            });
        } catch (e) {
            ApiError.handle(new BadRequestError(e.message), res);
        }
    }

}

module.exports = BookTableController;