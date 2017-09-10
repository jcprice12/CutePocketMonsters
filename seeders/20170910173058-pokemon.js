var converter = require("../dbResources/turnCsvToJson.js");

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return converter("pokemon_alopez247.csv").then(function(data){
      return queryInterface.bulkInsert('Pokemon', data, {});
    }).catch(function(err){
      throw err;
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pokemon', null, {});
  }
};
