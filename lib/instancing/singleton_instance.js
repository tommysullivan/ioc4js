module.exports = function SingletonInstance(instance, clazz) {
    return {
        instance: function() { return instance; },
        clazz: function() { return clazz; }
    }
}