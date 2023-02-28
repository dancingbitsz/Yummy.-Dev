module.exports = function (sequlize, DataTypes) {
    var vb_users = sequlize.define('users', {
        user_id: {
            type: DataTypes.STRING(500),
           primaryKey: true, 
            alllowNull: true,
           unique: true
        },
        name : DataTypes.STRING(100)
    }, {
        tablename: 'users',
        timestamps: false,
        underscored : true
    })

    users.associate = function (models) {
        
    }

    return users

}