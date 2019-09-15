'use strict';

const _ = require('lodash');
const chalk = require('chalk');

function isOptionsObject(arg) {
    return arg && _.isPlainObject(arg) && Object.prototype.hasOwnProperty.call(arg, '__isOptionsObject__');
}

module.exports = function(...args) {
    args = args.filter(x => x !== undefined);
    if (args.length === 0) return;

    const last = args[args.length - 1];
    const options = isOptionsObject(last) ? args.pop() : {};

    args = args.map((arg, index) => {
        // If benchmarking option is enabled, the last argument is the elapsed time
        if (index === args.length - 1 && options.benchmark) {
            return chalk.blue(`[Elapsed time: ${arg} ms]`);
        }
        return chalk.gray(arg);
    });

    console.log('[Sequelize]', ...args);
};