describe('ParameterResolverThatInstancesClassesWhoseNameMatchesParameter', function() {
    var parameterResolverThatInstancesClassesWhoseNameMatchesParameter;
    var reflection;
    var instancer;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils,$);
        var stringUtils = StringUtils(arrayUtils, $);
        reflection = jasmine.createSpyObj('reflection', ['classExists','getClass']);
        instancer = jasmine.createSpyObj('instancer', ['getOrCreateInstance']);
        parameterResolverThatInstancesClassesWhoseNameMatchesParameter = ParameterResolverThatInstancesClassesWhoseNameMatchesParameter(
            reflection, instancer, stringUtils
        );
    });

    it('should be instantiable', function() {
        expect(parameterResolverThatInstancesClassesWhoseNameMatchesParameter).not.toBeUndefined();
    });

    describe('canResolveParameter', function() {
        describe('when parameter name, taken to proper case, matches an existing class name', function() {
            it('should return true', function() {
                reflection.classExists.andReturn(true);
                var result = parameterResolverThatInstancesClassesWhoseNameMatchesParameter.canResolveParameter('className');
                expect(result).toBeTruthy();
            });
        });
        describe('when parameter name, taken to proper case, does not match an existing class name', function() {
            it('should return true', function() {
                reflection.classExists.andReturn(false);
                var result = parameterResolverThatInstancesClassesWhoseNameMatchesParameter.canResolveParameter('className');
                expect(result).toBeFalsy();
            });
        });
    });

    describe('resolveParameter', function() {
        it('should use reflection to get a reference to the class, then call to instancer passing along the namedLiteralConstructorParams and a modified constructionStack', function() {
            var constructorArgName = 'className';
            var namedLiteralConstructorParams = {}
            var constructionStack = []
            var fakeClass = function() {}
            var fakeInstance = {}
            reflection.getClass.andReturn(fakeClass);
            instancer.getOrCreateInstance.andReturn(fakeInstance);
            var result = parameterResolverThatInstancesClassesWhoseNameMatchesParameter.resolveParameter(
                constructorArgName, namedLiteralConstructorParams, constructionStack
            );
            expect(result).toBe(fakeInstance);
            expect(instancer.getOrCreateInstance).toHaveBeenCalledWith(
                fakeClass, namedLiteralConstructorParams, constructionStack
            );
        });
    });
});