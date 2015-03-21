describe('SingletonInstanceCollection', function() {
    var singletonInstanceCollection;
    var singletonInstanceFactory;
    var mockSingleton;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);

        mockSingleton = jasmine.createSpyObj(
            'mockSingleton',
            ['clazz','instance']
        );

        singletonInstanceFactory = jasmine.createSpyObj(
            'singletonInstanceFactory',
            ['createSingletonInstance']
        );

        singletonInstanceCollection = SingletonInstanceCollection(arrayUtils, singletonInstanceFactory);
    });

    it('should be instantiable', function() {
        expect(singletonInstanceCollection).not.toBeUndefined();
    });

    describe('hasSingletonInstance', function() {
        describe('when no singleton instance of the desired class has been added', function() {
            it('returns false', function() {
                var clazz = function() {}
                var someOtherClass = function() {}
                var instance = {}
                mockSingleton.clazz.andReturn(someOtherClass);
                expect(singletonInstanceCollection.hasSingletonInstance(clazz)).toBeFalsy();
            });
        });
        describe('when a singleton instance of the desired class has been added', function() {
            it('returns false', function() {
                var clazz = function() {}
                var instance = {}
                mockSingleton.clazz.andReturn(clazz);
                singletonInstanceFactory.createSingletonInstance.andReturn(mockSingleton);
                singletonInstanceCollection.registerSingletonInstance(instance, clazz);
                expect(singletonInstanceCollection.hasSingletonInstance(clazz)).toBeTruthy();
            });
        });
    });

    describe('registerSingletonInstance', function() {
        describe('when attempting to register a singleton that is already registered', function() {
            it('should throw an exception', function() {
                var clazz = function() {}
                var instance = {}
                var otherInstanceOfSameClass = {}
                mockSingleton.clazz.andReturn(clazz);
                singletonInstanceFactory.createSingletonInstance.andReturn(mockSingleton);
                singletonInstanceCollection.registerSingletonInstance(instance, clazz);
                expect(function() {
                    singletonInstanceCollection.registerSingletonInstance(otherInstanceOfSameClass, clazz);
                }).toThrow();
            });
        });
    });

    describe('getSingletonInstance', function() {
        it('should return a singleton instance that matches the class and instance that were registered', function() {
            var clazz = function() {}
            var instance = {}
            var otherInstanceOfSameClass = {}
            mockSingleton.clazz.andReturn(clazz);
            mockSingleton.instance.andReturn(instance);
            singletonInstanceFactory.createSingletonInstance.andReturn(mockSingleton);
            singletonInstanceCollection.registerSingletonInstance(instance, clazz);
            var instance = singletonInstanceCollection.getSingletonInstance(clazz);
            expect(instance).toBe(instance);
        });
    });
});