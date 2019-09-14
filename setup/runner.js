'use strict';

const Support = require('./support');

async function run() {
    if (!process.env.DIALECT) {
        throw new Error('Dialect not defined! Aborting');
    }

    if (process.env.LOCAL_SSCCE) {
        console.warn('Warning: running the SSCCE locally will use SQLite only. To run your SSCCE in all dialects, just configure Travis and Appveyor in your GitHub repository.');
    }

    console.log(`Running SSCCE for dialect '${process.env.DIALECT}'`);

    await require('./../src/sscce')(Support);
}

(async () => {
    try {
        run();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();