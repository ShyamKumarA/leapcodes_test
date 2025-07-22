'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash('SuperAdmin123', 10);
    const hashedPassword2 = await bcrypt.hash('User123', 10);

    await queryInterface.bulkInsert('user', [
      {
        username: 'SuperAdmin',
        email: 'superadmin@example.com',
        password: hashedPassword1,
        role: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'NormalUser',
        email: 'user@example.com',
        password: hashedPassword2,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
