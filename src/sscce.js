'use strict';

/**
 * The Sequelize SSCCE runner.
 * 
 * Please do everything inside it, including requiring dependencies.
 */
module.exports = async function(createSequelizeInstance) {

    const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    const sequelize = createSequelizeInstance({ benchmark: true });

    class User extends Sequelize.Model {}
    User.init({
            userName: {
                type: Sequelize.STRING,
                primaryKey: true,
                field: 'user_name',
            },
            email: {
                type: Sequelize.STRING,
            }
        },
        { sequelize }
    );
    
    const user1 = {
        userName: 'John Smith',
    };

    await sequelize.authenticate();
    await User.sync({ force: true });
    await User.bulkCreate([user1], {updateOnDuplicate: ['email']});

    console.log('Hello World!');

};