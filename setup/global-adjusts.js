'use strict';

const Sequelize = require('sequelize');

process.on('uncaughtException', e => {
  console.error('An unhandled exception occurred:');
  throw e;
});
process.on("unhandledRejection", e => {
  console.error('An unhandled rejection occurred:');
  throw e;
});
Sequelize.Promise.onPossiblyUnhandledRejection(e => {
  console.error('An unhandled rejection occurred:');
  throw e;
});

Sequelize.Promise.longStackTraces();