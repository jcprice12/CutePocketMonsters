module.exports = function(sequelize, DataTypes) {
    var UserPokemon = sequelize.define("UserPokemon", {
        "starting" : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        "createdAt" : {
            type: DataTypes.DATE,
            defaultValue : sequelize.literal('NOW()'),
            allowNull : false
        },
    }, {
        timestamps: false,
        tableName: "UserPokemon"
    });

    // UserPokemon.associate = function(models){
    //     UserPokemon.belongsToMany(models.Pokemon, {   /*belongtoMany*/
    //         // through: models.Pokemon,
    //         foreignKey: 'pokemonNumber'
    //     });
    // }

    return UserPokemon;
};