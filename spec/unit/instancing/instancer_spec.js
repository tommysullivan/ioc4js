describe('Instancer', function() {
    var instancer;
    var singletonInstancer;
    var onDemandInstancer;
    var singletonInstance;
    var onDemandInstance;
    var namedLiteralConstructorParams = { a: 'A', b: 'b' };
    var constructionStack = ['stackItem1','stackItem2'];

    function FakeClass() {}

    beforeEach(function() {
        singletonInstance = 'singletonInstance'
        onDemandInstance = 'onDemandInstance'

        singletonInstancer = jasmine.createSpyObj(
            'singletonInstancer',
            ['shouldBeSingleton', 'getOrCreateInstance']
        );
        singletonInstancer.getOrCreateInstance.andReturn(singletonInstance);

        onDemandInstancer = jasmine.createSpyObj(
            'singletonInstancer',
            ['getOrCreateInstance']
        );
        onDemandInstancer.getOrCreateInstance.andReturn(onDemandInstance);

        instancer = Instancer(singletonInstancer, onDemandInstancer);
    });

    it('should be instantiable', function() {
        expect(instancer).not.toBeUndefined();
    });

    describe('getOrCreateInstance', function() {
        describe('when singletonInstancer reports that it should be a singleton', function() {
            it('asks singletonInstancer to provide the instance', function() {
                singletonInstancer.shouldBeSingleton.andReturn(true);
                expect(instancer.getOrCreateInstance(FakeClass, namedLiteralConstructorParams, constructionStack)).toBe(singletonInstance);
                expect(singletonInstancer.getOrCreateInstance).toHaveBeenCalledWith(FakeClass, namedLiteralConstructorParams, constructionStack);
                expect(onDemandInstancer.getOrCreateInstance).not.toHaveBeenCalled();
            });
        });
        describe('when singletonInstancer reports that it should not be a singleton', function() {
            it('asks onDemandInstancer to provide the instance', function() {
                singletonInstancer.shouldBeSingleton.andReturn(false);
                expect(instancer.getOrCreateInstance(FakeClass, namedLiteralConstructorParams, constructionStack)).toBe(onDemandInstance);
                expect(onDemandInstancer.getOrCreateInstance).toHaveBeenCalledWith(FakeClass, namedLiteralConstructorParams, constructionStack);
                expect(singletonInstancer.getOrCreateInstance).not.toHaveBeenCalled();
            });
        });
    });
});