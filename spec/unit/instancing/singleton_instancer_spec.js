describe('SingletonInstancer', function() {
    var singletonInstancer;
    var singletonClasses;
    var singletonInstanceCollection;
    var onDemandInstancer;
    var classThatIsNotRegisteredAsSingleton;
    var classThatIsRegisteredAsSingleton;
    var namedLiteralConstructorParams;
    var constructionStack;
    var proxiedInstanceFactory;
    var proxiedInstance;
    var instanceProxyThatIsAddedToSingletonCollectionAndReturned;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        var otherClassThatIsRegisteredAsSingleton = function() {}
        namedLiteralConstructorParams = {}
        constructionStack = []
        classThatIsNotRegisteredAsSingleton = function() {}
        classThatIsRegisteredAsSingleton = function() {}
        singletonClasses = [otherClassThatIsRegisteredAsSingleton, classThatIsRegisteredAsSingleton]
        singletonInstanceCollection = jasmine.createSpyObj(
            'SingletonInstanceCollection',
            ['hasSingletonInstance','registerSingletonInstance','getSingletonInstance']
        );
        onDemandInstancer = jasmine.createSpyObj(
            'OnDemandInstancer',
            ['getOrCreateInstance']
        );
        instanceProxyThatIsAddedToSingletonCollectionAndReturned = {}
        proxiedInstance = jasmine.createSpyObj(
            'proxiedInstance',
            ['getProxy','setRealInstance']
        );
        proxiedInstance.getProxy.andReturn(instanceProxyThatIsAddedToSingletonCollectionAndReturned);
        proxiedInstanceFactory = jasmine.createSpyObj(
            'proxiedInstanceFactory',
            ['createProxiedInstance']
        );
        proxiedInstanceFactory.createProxiedInstance.andReturn(proxiedInstance);
        singletonInstancer = SingletonInstancer(
            arrayUtils,
            singletonClasses,
            singletonInstanceCollection,
            onDemandInstancer,
            proxiedInstanceFactory
        );
    });

    it('should be instantiable', function() {
        expect(singletonInstancer).not.toBeUndefined();
    });

    describe('shouldBeSingleton', function() {
        describe('when class is not registered as one that should be a singleton', function() {
            it('returns false', function() {
                expect(singletonInstancer.shouldBeSingleton(classThatIsNotRegisteredAsSingleton)).toBeFalsy();
            });
        });
        describe('when class is registered as one that should be a singleton', function() {
            it('returns true', function() {
                expect(singletonInstancer.shouldBeSingleton(classThatIsRegisteredAsSingleton)).toBeTruthy();
            });
        });
    });

    describe('getOrCreateInstance', function() {
        describe('when the singletonCollection already has an instance of the requested class', function() {
            it('should return the existing instance', function() {
                var existingInstance = {}
                singletonInstanceCollection.hasSingletonInstance.andReturn(true);
                singletonInstanceCollection.getSingletonInstance.andReturn(existingInstance);
                expect(
                    singletonInstancer.getOrCreateInstance(classThatIsRegisteredAsSingleton, namedLiteralConstructorParams, constructionStack)
                ).toBe(existingInstance);
            });
        });
        describe('when the singletonCollection does not have an instance of the requested class', function() {
            it('should ask the on demand instancer to construct it and then add a proxy to it to the collection, returning the proxy', function() {
                var newInstance = {}
                onDemandInstancer.getOrCreateInstance.andReturn(newInstance);
                singletonInstanceCollection.hasSingletonInstance.andReturn(false);
                expect(
                    singletonInstancer.getOrCreateInstance(classThatIsRegisteredAsSingleton, namedLiteralConstructorParams, constructionStack)
                ).toBe(instanceProxyThatIsAddedToSingletonCollectionAndReturned);
                expect(onDemandInstancer.getOrCreateInstance).toHaveBeenCalledWith(classThatIsRegisteredAsSingleton, namedLiteralConstructorParams, constructionStack);
                expect(singletonInstanceCollection.registerSingletonInstance).toHaveBeenCalledWith(instanceProxyThatIsAddedToSingletonCollectionAndReturned, classThatIsRegisteredAsSingleton);
                expect(proxiedInstance.setRealInstance).toHaveBeenCalledWith(newInstance);
            });
        });
    });
});