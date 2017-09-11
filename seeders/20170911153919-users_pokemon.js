'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('UserPokemon',
    [
      {
        userId: 1,
        pokemonNumber: 1,
        starting: true
      },
      {
        userId: 1,
        pokemonNumber: 2,
        starting: true
      },
      {
        userId: 1,
        pokemonNumber: 3,
        starting: true
      },
      {
        userId: 1,
        pokemonNumber: 4,
        starting: true
      },
      {
        userId: 1,
        pokemonNumber: 5,
        starting: true
      },
      {
        userId: 1,
        pokemonNumber: 6,
        starting: true
      },
      {
        userId: 1,
        pokemonNumber: 7,
        starting: false
      },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('UsersPokemon', null, {});
  }
};
