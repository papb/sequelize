'use strict';

if (!process.env.DIALECT) {
  throw new Error('Dialect not defined');
}

console.log('Running:', process.env.DIALECT);

const Sequelize = require('sequelize');
const sequelize = require('./test/support').createSequelizeInstance();

sequelize.authenticate().then(() => {
  console.log('Authenticated!');
});