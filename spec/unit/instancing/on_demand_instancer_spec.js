describe('OnDemandInstancer', function() {
    var onDemandInstancer;
    var parameterResolver;
    var resolvedConstructorParam1 = 1;
    var resolvedConstructorParam2 = '2';
    var resolvedConstructorParam3 = false;

    beforeEach(function() {
        var resolvedConstructorParameters = [resolvedConstructorParam1, resolvedConstructorParam2, resolvedConstructorParam3]
        parameterResolver = jasmine.createSpyObj('parameterResolver', ['resolveParameters']);
        parameterResolver.resolveParameters.andReturn(resolvedConstructorParameters);
        onDemandInstancer = OnDemandInstancer(parameterResolver);
    });

    it('should be instantiable', function() {
        expect(onDemandInstancer).not.toBeUndefined();
    })

    describe('getOrCreateInstance', function() {
        it('should ask constructorParameterResolver to resolve the parameters, then call the constructor with those, and return the new instance', function() {
            var expectedInstance = {}
            var classReference = jasmine.createSpy('FakeClassReference').andReturn(expectedInstance);
            var namedLiteralConstructorParams = { a: 'a', b: 'b' }
            var constructionStack = []
            expect(
                onDemandInstancer.getOrCreateInstance(
                    classReference,
                    namedLiteralConstructorParams,
                    constructionStack
                )
            ).toBe(expectedInstance);
            expect(classReference).toHaveBeenCalledWith(resolvedConstructorParam1, resolvedConstructorParam2, resolvedConstructorParam3);
            expect(
                parameterResolver.resolveParameters
            ).toHaveBeenCalledWith(
                classReference,
                namedLiteralConstructorParams,
                constructionStack
            );
        });
    });
});