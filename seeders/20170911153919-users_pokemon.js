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
      {
        userId: 2,
        pokemonNumber: 1,
        starting: true
      },
      {
        userId: 2,
        pokemonNumber: 2,
        starting: true
      },
      {
        userId: 2,
        pokemonNumber: 3,
        starting: true
      },
      {
        userId: 2,
        pokemonNumber: 4,
        starting: true
      },
      {
        userId: 2,
        pokemonNumber: 5,
        starting: true
      },
      {
        userId: 2,
        pokemonNumber: 8,
        starting: true
      },
      {
        userId: 2,
        pokemonNumber: 9,
        starting: false
      },
      {
        userId: 3,
        pokemonNumber: 50,
        starting: true
      },
      {
        userId: 3,
        pokemonNumber: 51,
        starting: true
      },
      {
        userId: 3,
        pokemonNumber: 52,
        starting: true
      },
      {
        userId: 3,
        pokemonNumber: 53,
        starting: true
      },
      {
        userId: 3,
        pokemonNumber: 54,
        starting: true
      },
      {
        userId: 3,
        pokemonNumber: 8,
        starting: true
      },
      {
        userId: 3,
        pokemonNumber: 1,
        starting: false
      },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('UsersPokemon', null, {});
  }
};
