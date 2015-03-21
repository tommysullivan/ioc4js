describe('ParameterResolverThatGeneratesFactories', function() {
    var parameterResolverThatGeneratesFactories;
    var magicFactoryCreator;
    var magicFactory;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        var stringUtils = StringUtils(arrayUtils, $);
        magicFactory = {}
        magicFactoryCreator = jasmine.createSpyObj(
            'magicFactoryCreator',['createMagicFactory']
        );
        magicFactoryCreator.createMagicFactory.andReturn(magicFactory);
        parameterResolverThatGeneratesFactories = ParameterResolverThatGeneratesFactories(
            magicFactoryCreator, stringUtils
        );
    });

    it('should be instantiable', function() {
        expect(parameterResolverThatGeneratesFactories).not.toBeUndefined();
    });

    describe('canResolveParameter', function() {
        describe('when the parameter name ends with MagicFactory', function() {
            it('should return true', function() {
                var result = parameterResolverThatGeneratesFactories.canResolveParameter('someClassMagicFactory');
                expect(result).toBeTruthy();
            });
        });
        describe('when the parameter name does not end with MagicFactory', function() {
            it('should return false', function() {
                var result = parameterResolverThatGeneratesFactories.canResolveParameter('someClassThatIsNotMagic');
                expect(result).toBeFalsy();
            });
        });
    });

    describe('resolveParameter', function() {
        it('should call the magicFactoryCreator to get the object and return it', function() {
            var parameterName = 'fakeClassMagicFactory';
            var namedLiteralConstructorParametersAtFactoryCreationTime = {}
            var constructionStack = []
            var result = parameterResolverThatGeneratesFactories.resolveParameter(parameterName, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack);
            expect(magicFactoryCreator.createMagicFactory).toHaveBeenCalledWith('FakeClass', namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack);
            expect(result).toBe(magicFactory);
        });
    });
});