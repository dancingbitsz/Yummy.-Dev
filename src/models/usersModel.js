"use strict";
module.exports = function (sequelize, DataTypes) {
  var ym_users = sequelize.define(
    "ym_users",
    {
      user_id: {
        type: DataTypes.STRING(500),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      first_name: DataTypes.STRING(255),
      last_name: DataTypes.STRING(255),
      email: DataTypes.STRING(255),
      password: DataTypes.STRING(255),
      access_token: DataTypes.STRING(255),
      created_datetime: DataTypes.STRING(255),
      updated_datetime: DataTypes.STRING(255),
      is_deleted: DataTypes.NUMBER(11)
    },
    {
      tableName: "ym_users",
      timestamps: false,
      underscored: true
    }
  );
  
  ym_users.associate = function (models) {
    ym_users.hasMany(models.userBookingTable, {
      foreignKey: 'user_id',
      targetKey: 'user_id'
  });
  }

  return ym_users;
};
