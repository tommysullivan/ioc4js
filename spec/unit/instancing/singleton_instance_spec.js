describe('SingletonInstance', function() {
    var singletonInstance;
    var instance;
    var clazz;

    beforeEach(function() {
        instance = {}
        clazz = function() {}
        singletonInstance = SingletonInstance(instance, clazz);
    });

    it('should be instantiable', function() {
        expect(singletonInstance).not.toBeUndefined();
    });

    describe('instance', function() {
        it('should return the instance with which it was constructed', function() {
            expect(singletonInstance.instance()).toBe(instance);
        });
    });

    describe('clazz', function() {
        it('should return the clazz with which it was constructed', function() {
            expect(singletonInstance.clazz()).toBe(clazz);
        });
    });
});