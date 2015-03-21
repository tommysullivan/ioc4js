module.exports = function ClassNotFoundExceptionFactory() {
    return {
        createClassNotFoundException: function(className) {
            return ClassNotFoundException(className);
        }
    }
}