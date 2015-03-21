describe('ParameterResolverThatUsesConfiguredFactoryFunctions', function() {
    var parameterResolverThatUsesConfiguredFactories;
    var configuredFactoriesKeyedByParamName;
    var instancer;
    var constructionStack;
    var namedLiteralConstructorParameters;
    var expectedParamValue;
    var constructorArgNameThatShouldBeFound = 'paramName';
    var constructorArgNameThatShouldNotBeFound = 'paramNameThatShouldNotBeFound';

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        var caseInsensitiveMatchPredicateProvider = CaseInsensitiveMatchPredicateProvider();
        namedLiteralConstructorParameters = {}
        constructionStack = ['stack1','stack2'];
        configuredFactoriesKeyedByParamName = {
            paramName: function() {},
            notMatchingParamName: function() {},
            otherNotMatchingParamName: function() {}
        }
        instancer = jasmine.createSpyObj('instancer',['getOrCreateInstance']);
        expectedParamValue = {}
        instancer.getOrCreateInstance.andReturn(expectedParamValue);
        configuredFactoriesKeyedByParamName.paramName = function() {}
        configuredFactoriesKeyedByParamName.notMatchingParamName = function() {}

        parameterResolverThatUsesConfiguredFactories = ParameterResolverThatUsesConfiguredFactoryFunctions(
            arrayUtils, configuredFactoriesKeyedByParamName, caseInsensitiveMatchPredicateProvider, instancer
        );
    });

    it('should be instantiable', function() {
        expect(parameterResolverThatUsesConfiguredFactories).not.toBeUndefined();
    });

    describe('canResolveParameter', function() {
        describe('when there is no factory by that name', function() {
            it('should return false', function() {
                var result = parameterResolverThatUsesConfiguredFactories.canResolveParameter(
                    constructorArgNameThatShouldNotBeFound
                );
                expect(result).toBeFalsy();
            });
        });
        describe('when there is a factory by that name', function() {
            it('should return true', function() {
                var result = parameterResolverThatUsesConfiguredFactories.canResolveParameter(
                    constructorArgNameThatShouldBeFound
                );
                expect(result).toBeTruthy();
            });
        });
    });

    describe('resolveParameter', function() {
        it('should invoke the factory and return the resulting object', function() {
            var paramValue = parameterResolverThatUsesConfiguredFactories.resolveParameter(
                constructorArgNameThatShouldBeFound, namedLiteralConstructorParameters, constructionStack
            );
            expect(paramValue).toBe(expectedParamValue);
            expect(instancer.getOrCreateInstance).toHaveBeenCalledWith(
                configuredFactoriesKeyedByParamName.paramName,
                namedLiteralConstructorParameters,
                constructionStack
            );
        });
    });
});