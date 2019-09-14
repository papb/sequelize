'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const Config = require('./config');

// Make sure errors get thrown when testing
process.on('uncaughtException', e => {
  console.error('An unhandled exception occurred:');
  throw e;
});
Sequelize.Promise.onPossiblyUnhandledRejection(e => {
  console.error('An unhandled rejection occurred:');
  throw e;
});
Sequelize.Promise.longStackTraces();

const Support = {
  prepareTransactionTest(sequelize) {
    const dialect = Support.getTestDialect();

    if (dialect === 'sqlite') {
      jetpack.remove('tmp/db.sqlite');
      const options = Object.assign({}, sequelize.options, { storage: p }),
        _sequelize = new Sequelize(sequelize.config.database, null, null, options);

      return _sequelize.sync({ force: true }).return(_sequelize);
    }
    return Sequelize.Promise.resolve(sequelize);
  },

  createSequelizeInstance(options) {
    options = options || {};
    options.dialect = this.getTestDialect();

    const config = Config[options.dialect];

    const sequelizeOptions = _.defaults(options, {
      host: options.host || config.host,
      logging: process.env.SEQ_LOG ? console.log : false,
      dialect: options.dialect,
      port: options.port || process.env.SEQ_PORT || config.port,
      pool: config.pool,
      dialectOptions: options.dialectOptions || config.dialectOptions || {}
    });

    if (process.env.DIALECT === 'postgres-native') {
      sequelizeOptions.native = true;
    }

    if (config.storage) {
      sequelizeOptions.storage = config.storage;
    }

    return this.getSequelizeInstance(config.database, config.username, config.password, sequelizeOptions);
  },

  getConnectionOptions() {
    const config = Config[this.getTestDialect()];

    delete config.pool;

    return config;
  },

  getSequelizeInstance(db, user, pass, options) {
    options = options || {};
    options.dialect = options.dialect || this.getTestDialect();
    return new Sequelize(db, user, pass, options);
  },

  clearDatabase(sequelize) {
    return sequelize
      .getQueryInterface()
      .dropAllTables()
      .then(() => {
        sequelize.modelManager.models = [];
        sequelize.models = {};

        return sequelize
          .getQueryInterface()
          .dropAllEnums();
      })
      .then(() => {
        return this.dropTestSchemas(sequelize);
      });
  },

  dropTestSchemas(sequelize) {

    const queryInterface = sequelize.getQueryInterface();
    if (!queryInterface.QueryGenerator._dialect.supports.schemas) {
      return this.sequelize.drop({});
    }

    return sequelize.showAllSchemas().then(schemas => {
      const schemasPromise = [];
      schemas.forEach(schema => {
        const schemaName = schema.name ? schema.name : schema;
        if (schemaName !== sequelize.config.database) {
          schemasPromise.push(sequelize.dropSchema(schemaName));
        }
      });
      return Promise.all(schemasPromise.map(p => p.catch(e => e)))
        .then(() => {}, () => {});
    });
  },

  getTestDialect() {
    let envDialect = process.env.DIALECT || 'mysql';

    if (envDialect === 'postgres-native') {
      envDialect = 'postgres';
    }

    return envDialect;
  },

  getTestDialectTeaser(moduleName) {
    let dialect = this.getTestDialect();

    if (process.env.DIALECT === 'postgres-native') {
      dialect = 'postgres-native';
    }

    return `[${dialect.toUpperCase()}] ${moduleName}`;
  },

};

module.exports = Support;