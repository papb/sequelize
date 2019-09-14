'use strict';

require('./global-adjusts');

async function run() {
    const createSequelizeInstance = require('./create-sequelize-instance');

    if (process.env.LOCAL_SSCCE) {
        console.warn('Warning: running the SSCCE locally will use SQLite only. To run your SSCCE in all dialects, just configure Travis and Appveyor in your GitHub repository.');
    }

    console.log(`Running SSCCE for dialect '${process.env.DIALECT}'`);

    await require('./../src/sscce')(createSequelizeInstance);
}

(async () => {
    try {
        run();
    } catch (e) {
        console.error(e);
        process.exit(1); // eslint-disable-line no-process-exit
    }
})();