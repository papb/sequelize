'use strict';

const _ = require('lodash');
const chalk = require('chalk');

function isOptionsObject(arg) {
    console.log('Checking if isOptionsObject:', arg);
    const result = arg && _.isPlainObject(arg) && Object.prototype.hasOwnProperty.call(arg, '__isOptionsObject__');
    return result;
}

module.exports = function(...args) {
    args = args.filter(x => x !== undefined);
    if (args.length === 0) return;

    const last = args[args.length - 1];
    const options = isOptionsObject(last) ? args.pop() : {};

    args = args.map((arg, index) => {
        // If benchmarking option is enabled, the last argument is the elapsed time
        if (index === args.length - 1 && options.benchmark) {
            return `[Elapsed time: ${arg} ms]`;
        }
        return arg;
    });

    console.log('[Sequelize]', ...args);
};