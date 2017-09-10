var converter = require("../dbResources/turnCsvToJson.js");

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Pokemon', converter("pokemon_alopez247.csv"), {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pokemon', null, {});
  }
};
