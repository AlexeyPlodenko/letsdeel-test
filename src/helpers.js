/**
 * @param {...*} args
 */
exports.d = (...args) => {
    console.log(...args);
    process.exit(1);
};
