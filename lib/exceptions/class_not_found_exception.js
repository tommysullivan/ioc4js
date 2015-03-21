module.exports = function ClassNotFoundException(className) {
    return new Error('Class not found: '+className);
}