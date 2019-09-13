'use strict';

if (!process.env.DIALECT) {
  throw new Error('Dialect not defined');
}

console.log(`Running SSCCE for dialect '${process.env.DIALECT}'`);

const runSscce = require('./src/sscce');

runSscce();