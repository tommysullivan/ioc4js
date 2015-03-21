module.exports = function SingletonInstanceFactory() {
    return {
        createSingletonInstance: function(instance, clazz) {
            return SingletonInstance(instance, clazz);
        }
    }
}