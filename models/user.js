module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        "username" : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : true,
            validate : {
                len : [4,32]
            }
        },
        "password" : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                len : [4]
            }
        },
        "email" : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : true,
            validate : {
                len : [3]
            }
        }
    }, {
        timestamps: false
    });

    User.associate = function(models){
        
    }

    return User;
};