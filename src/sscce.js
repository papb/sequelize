'use strict';

/**
 * The Sequelize SSCCE runner.
 * 
 * Please do everything inside it, including requiring dependencies.
 */
module.exports = async function(createSequelizeInstance) {

    // const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    const sequelize = createSequelizeInstance({
        benchmark: true
    });

    await sequelize.authenticate();

    console.log('Hello World!');

};