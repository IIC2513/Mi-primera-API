// src/seeders/*-first-movies.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Movies', [{
      title: 'Arrival',
      genre: 'Sci-fi/Thriller',
      description: 'Louise Banks, a linguistics expert, along with her team, must interpret the language of aliens who have come to Earth in a mysterious spaceship.',
      rating: 7.9,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Gone Girl',
      genre: 'Thriller/Mystery',
      description: 'Nick Dunne discovers that the entire media focus has shifted on him when his wife, Amy Dunne, mysteriously disappears on the day of their fifth wedding anniversary.',
      rating: 8.1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Movies', null, {});
  }
};
