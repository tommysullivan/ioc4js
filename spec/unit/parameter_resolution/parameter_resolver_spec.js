describe('ParameterResolver', function() {
    var parameterResolver;
    var autoFactoryInjector;
    var configuredFactoryInstancer;
    var instancer;
    var reflection;
    var resolver1;
    var resolver2;
    var namedLiteralConstructorParams;
    var constructionStack;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        var stringUtils = StringUtils(arrayUtils, $);
        var functionUtils = FunctionUtils(arrayUtils, stringUtils);
        namedLiteralConstructorParams = {}
        constructionStack = []
        resolver1 = {
            canResolveParameter: function(argName) { return argName=='p1'; },
            resolveParameter: function() { return 'p1Value'; }
        }
        resolver2 = {
            canResolveParameter: function(argName) { return argName=='p2'; },
            resolveParameter: function() { return 'p2Value'; }
        }
        var parameterResolversInIncreasingPrecedenceOrder = [resolver1, resolver2]
        parameterResolver = ParameterResolver(
            functionUtils, arrayUtils, parameterResolversInIncreasingPrecedenceOrder
        );
    });

    it('should be instantiable', function() {
        expect(parameterResolver).not.toBeUndefined();
    });

    describe('resolveParameters', function() {
        describe('when, between all the parameterResolvers, each parameter can be resolved', function() {
            it('should return an array of resolved parameter values', function() {
                var clazz = function(p1,p2) {}
                var constructorArgValues = parameterResolver.resolveParameters(
                    clazz, namedLiteralConstructorParams, constructionStack
                );
                expect(constructorArgValues).toEqual(['p1Value','p2Value']);
            });
        });
        describe('when, between all the parameterResolvers, not all parameters can be resolved', function() {
            it('should return an array of resolved parameter values', function() {
                var clazz = function(p1,p2,p3) {}
                expect(function() {
                    parameterResolver.resolveParameters(
                        clazz, namedLiteralConstructorParams, constructionStack
                    );
                }).toThrow();
            });
        });
    });
});