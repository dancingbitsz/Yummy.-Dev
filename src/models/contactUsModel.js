
"use strict";
module.exports = function (sequelize, DataTypes) {
  var ym_contact_us = sequelize.define("ym_contact_us",
    {
      contact_us_id: {
        type: DataTypes.STRING(500),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      user_id: DataTypes.STRING(255),
      name: DataTypes.STRING(255),
      email: DataTypes.STRING(255),
      subject: DataTypes.TEXT,
      message: DataTypes.TEXT,
      created_datetime: DataTypes.STRING(255),
      updated_datetime: DataTypes.STRING(255),
      is_deleted: DataTypes.NUMBER(11)
    },
    {
      tableName: "ym_contact_us",
      timestamps: false,
      underscored: true
    }
  );

  return ym_contact_us;
};
