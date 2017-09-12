'use strict';
var password_hash = require("password-hash");

function hashPassword(pass){
  var hash = password_hash.generate(pass, {
    algorithm : 'sha256',
    saltLength : 16,
  });
  return hash;
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: "test",
        password: hashPassword("password"),
        email: "test@test.com"
      },
      {
        username: "best",
        password: hashPassword("password"),
        email: "best@best.com"
      },
      {
        username: "rest",
        password: hashPassword("password"),
        email: "rest@rest.com"
      },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
