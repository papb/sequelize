'use strict';

const { Sequelize, Op, Model, DataTypes } = require('sequelize');

module.exports = async function({ createSequelizeInstance }) {
    const sequelize = createSequelizeInstance();
    await sequelize.authenticate();
    console.log('Authenticated!');
};