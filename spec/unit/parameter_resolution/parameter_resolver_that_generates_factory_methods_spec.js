describe('ParameterResolverThatGeneratesFactoryMethods', function() {
    var parameterResolverThatGeneratesFactoryMethods;
    var magicFactoryCreator;
    var magicFactory;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        magicFactory = {
            createInstanceUsingPartialConstructorParameters: function() {}
        }
        magicFactoryCreator = jasmine.createSpyObj(
            'magicFactoryCreator',['createMagicFactory']
        );
        magicFactoryCreator.createMagicFactory.andReturn(magicFactory);

        parameterResolverThatGeneratesFactoryMethods = ParameterResolverThatGeneratesFactoryMethods(
            magicFactoryCreator
        );
    });

    it('should be instantiable', function() {
        expect(parameterResolverThatGeneratesFactoryMethods).not.toBeUndefined();
    });

    describe('canResolveParameter', function() {
        describe('when the parameter name starts with a capital letter', function() {
            it('should return true', function() {
                var result = parameterResolverThatGeneratesFactoryMethods.canResolveParameter('CapitalConstructorParameterName');
                expect(result).toBeTruthy();
            });
        });
        describe('when the parameter name starts with a lowercase letter', function() {
            it('should return false', function() {
                var result = parameterResolverThatGeneratesFactoryMethods.canResolveParameter('lowercaseConstructorParameterName');
                expect(result).toBeFalsy();
            });
        });
    });

    describe('resolveParameter', function() {
        it('should call the magicFactoryCreator to get the object, then return its method', function() {
            var argumentName = 'FakeClass';
            var namedLiteralConstructorParametersAtFactoryCreationTime = {}
            var constructionStack = []
            var result = parameterResolverThatGeneratesFactoryMethods.resolveParameter(argumentName, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack);
            expect(magicFactoryCreator.createMagicFactory).toHaveBeenCalledWith(argumentName, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack);
            expect(result).toBe(magicFactory.createInstanceUsingPartialConstructorParameters);
        });
    });
});