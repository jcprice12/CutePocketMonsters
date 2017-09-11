module.exports = function(sequelize, DataTypes) {
    var UserPokemon = sequelize.define("UserPokemon", {
        "starting" : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        }
    }, {
        timestamps: false,
        tableName: "UserPokemon"
    });

    return UserPokemon;
};