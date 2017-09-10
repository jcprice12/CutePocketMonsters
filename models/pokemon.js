module.exports = function(sequelize, DataTypes) {
    var Pokemon = sequelize.define("Pokemon", {
        "Number" : {
            type: DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false,
            validate : {
                isInt : true
            }
        },
        "Name" : {
            type: DataTypes.STRING,
            allowNull : false,
            validate : {
                len : [1,250]
            }
        },
        "Type_1" : {
            type: DataTypes.STRING,
            allowNull : false,
            validate : {
                len : [1,250]
            }
        },
        "Type_2" : {
            type: DataTypes.STRING,
            allowNull : true,
        },
        "Total" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0,
                max : 6000,
                isInt : true
            }
        },
        "HP" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0,
                max : 1000,
                isInt : true
            }
        },
        "Attack" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0,
                max : 1000,
                isInt : true
            }
        }, 
        "Defense" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0,
                max : 1000,
                isInt : true
            }
        },
        "Sp_Atk" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0,
                max : 1000,
                isInt : true
            }
        },
        "Sp_Def" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0,
                max : 1000,
                isInt : true
            }
        },
        "Speed" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0,
                max : 1000,
                isInt : true
            }
        },
        "Generation" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 1,
                max : 100,
                isInt : true
            }
        },
        "isLegendary" : {
            type: DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false,
        },
        "Color" : {
            type: DataTypes.STRING,
            allowNull : false,
            validate : {
                len : [1,250]
            }
        },
        "hasGender" : {
            type: DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : true,
        },
        "Pr_Male" : {
            type: DataTypes.DECIMAL,
            allowNull : true,
            defaultValue : 0.5,
            validate : {
                min : 0
            }
        },
        "Egg_Group_1" : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                len : [1,250]
            }
        },
        "Egg_Group_2" : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        "hasMegaEvolution" : {
            type: DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false,
        },
        "Height_m" : {
            type: DataTypes.DECIMAL,
            allowNull : false,
            validate : {
                min : 0
            }
        },
        "Weight_kg" : {
            type: DataTypes.DECIMAL,
            allowNull : false,
            validate : {
                min : 0
            }
        },
        "Catch_Rate" : {
            type: DataTypes.INTEGER,
            allowNull : false,
            validate : {
                min : 0
            }
        },
        "Body_Style" : {
            type: DataTypes.STRING,
            allowNull : false,
            validate : {
                len : [1,250]
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Pokemon.associate = function(models){
        
    }

    return Pokemon;
};