const {Sequelize} = require('sequelize');
var path = require('path');


var sql = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_USER_PWD,
    dialect: 'mysql',
    logging: false
};

var sqlReader, sqlWriter;

console.log("Local DB Server Structure Model");
sqlReader = {
    ...sql,
    host: process.env.DB_HOST_READER,
    timezone: '+05:00'
}
sqlWriter = {
    ...sql,
    host: process.env.DB_HOST_WRITER,
    timezone: '+05:00'
}

// Connection
var [dbReader, dbWriter] = [{
    sequelize: new Sequelize(
        sql.database,
        sql.username,
        sql.password,
        sqlReader
    )
}, {
    sequelize: new Sequelize(
        sql.database,
        sql.username,
        sql.password,
        sqlWriter
    )
}];

var DbInstance = [{
    'name': dbReader
}, {
    'name': dbWriter
}]

DbInstance.forEach(element => {
    // Model Map    
    element.name['users'] = require(path.join(__dirname, './usersModel'))(element.name['sequelize'], Sequelize);
    element.name['userBookingTable'] = require(path.join(__dirname, './userBookingTableModel'))(element.name['sequelize'], Sequelize);

    // Model Association
    Object.keys(element.name).forEach(function (modelName) {
        if ('associate' in element.name[modelName]) {
            element.name[modelName].associate(element.name);
        }
    });
});


dbReader.Sequelize = Sequelize
dbWriter.Sequelize = Sequelize

module.exports = { dbReader, dbWriter };