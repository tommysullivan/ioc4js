describe('SingletonInstanceFactory', function() {
    it('should return a new instance of SingletonInstance', function() {
        var singletonInstanceFactory = SingletonInstanceFactory();
        var instance = {}
        var clazz = function() {}
        var instance = singletonInstanceFactory.createSingletonInstance(instance, clazz);
        expect(instance).not.toBeUndefined();
    });
});