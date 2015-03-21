describe('ParameterResolverThatUsesNamedLiterals', function() {
    var parameterResolverThatUsesNamedLiterals;
    var configuredNamedLiteralConstructorParameters;
    var caseInsensitiveMatchPredicateProvider;
    var matchingParamValue = 'matchingParamValue';
    var constructionStack;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        configuredNamedLiteralConstructorParameters = {
            noMatch: 'noMatch',
            matchingParameterName: matchingParamValue
        }
        constructionStack = [];
        configuredNamedLiteralConstructorParameters.noMatch = 'noMatch';
        configuredNamedLiteralConstructorParameters.matchingParameterName = matchingParamValue;
        caseInsensitiveMatchPredicateProvider = CaseInsensitiveMatchPredicateProvider();
        parameterResolverThatUsesNamedLiterals = ParameterResolverThatUsesNamedLiterals(
            arrayUtils, caseInsensitiveMatchPredicateProvider, configuredNamedLiteralConstructorParameters
        );
    });

    it('should be instantiable', function() {
        expect(parameterResolverThatUsesNamedLiterals).not.toBeUndefined();
    });

    describe('canResolveParameter', function() {
        describe('when requested parameter name does not match keys in either immediate namedLiteralConstructorParameters or configuredNamedLiteralConstructorParameters', function() {
            it('will return false', function() {
                var namedLiteralConstructorParameters = {}
                var result = parameterResolverThatUsesNamedLiterals.canResolveParameter('notFoundParam',namedLiteralConstructorParameters,constructionStack);
                expect(result).toBeFalsy();
            });
        });
        describe('when requested parameter name matches (case-insensitive) a key in configuredNamedLiteralConstructorParameters and not in immediate namedLiteralConstructorParameters', function() {
            it('will return true', function() {
                var result = parameterResolverThatUsesNamedLiterals.canResolveParameter('maTCHingpAraMeteRName',{},constructionStack);
                expect(result).toBeTruthy();
            });
        });
        describe('when requested parameter name matches (case-insensitive) a key in configuredNamedLiteralConstructorParameters AND immediate namedLiteralConstructorParameters', function() {
            it('will return true', function() {
                var overriddenParamValue = 'overridden immediate value';
                var namedLiteralConstructorParameters = {
                    matchingParameterName: overriddenParamValue
                }
                var result = parameterResolverThatUsesNamedLiterals.canResolveParameter('maTCHingpAraMeteRName',namedLiteralConstructorParameters,constructionStack);
                expect(result).toBeTruthy();
            });
        });
        describe('when requested parameter name matches (case-insensitive) a key in immediate namedLiteralConstructorParameters but not in configuredNamedLiteralConstructorParameters', function() {
            it('will return true', function() {
                var immediateValue = 'immediate value';
                var namedLiteralConstructorParameters = {
                    immediateParamName: immediateValue
                }
                var result = parameterResolverThatUsesNamedLiterals.canResolveParameter('immediateParaMNaMe',namedLiteralConstructorParameters,constructionStack);
                expect(result).toBeTruthy();
            });
        });
    });

    describe('resolveParameter', function() {
        describe('when requested parameter name matches (case-insensitive) a key in configuredNamedLiteralConstructorParameters and not in immediate namedLiteralConstructorParameters', function() {
            it('will return the corresponding value for that key', function() {
                var resolvedValue = parameterResolverThatUsesNamedLiterals.resolveParameter('maTCHingpAraMeteRName',{},constructionStack);
                expect(resolvedValue).toBe(matchingParamValue);
            });
        });
        describe('when requested parameter name matches (case-insensitive) a key in configuredNamedLiteralConstructorParameters AND immediate namedLiteralConstructorParameters', function() {
            it('will return the value for that key in namedLiteralConstructorParameters, overriding the configuredNamedLiteralConstructorParameters', function() {
                var overriddenParamValue = 'overridden immediate value';
                var namedLiteralConstructorParameters = {
                    matchingParameterName: overriddenParamValue
                }
                var resolvedValue = parameterResolverThatUsesNamedLiterals.resolveParameter('maTCHingpAraMeteRName',namedLiteralConstructorParameters,constructionStack);
                expect(resolvedValue).toBe(overriddenParamValue);
            });
        });
        describe('when requested parameter name matches (case-insensitive) a key in immediate namedLiteralConstructorParameters but not in configuredNamedLiteralConstructorParameters', function() {
            it('will return the value for that key in namedLiteralConstructorParameters', function() {
                var immediateValue = 'immediate value';
                var namedLiteralConstructorParameters = {
                    immediateParamName: immediateValue
                }
                var resolvedValue = parameterResolverThatUsesNamedLiterals.resolveParameter('immediateParaMNaMe',namedLiteralConstructorParameters,constructionStack);
                expect(resolvedValue).toBe(immediateValue);
            });
        });
    });
});