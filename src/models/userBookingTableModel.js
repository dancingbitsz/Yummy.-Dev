
"use strict";
module.exports = function (sequelize, DataTypes) {
  var ym_user_booking_table = sequelize.define("ym_user_booking_table",
    {
      book_table_id: {
        type: DataTypes.STRING(500),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      user_id: DataTypes.STRING(255),
      name: DataTypes.STRING(255),
      email: DataTypes.STRING(255),
      phone: DataTypes.NUMBER(20),
      booking_date: DataTypes.STRING(255),
      booking_time: DataTypes.STRING(255),
      people: DataTypes.NUMBER(100),
      message: DataTypes.TEXT,
      created_datetime: DataTypes.STRING(255),
      updated_datetime: DataTypes.STRING(255),
      is_deleted: DataTypes.NUMBER(11)
    },
    {
      tableName: "ym_user_booking_table",
      timestamps: false,
      underscored: true
    }
  );

  

  return ym_user_booking_table;
};
