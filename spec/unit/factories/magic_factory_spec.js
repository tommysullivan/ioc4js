describe('MagicFactory', function() {
    var factoryThatIsGeneratedByDependencyInjection;
    var namedLiteralConstructorParametersAtFactoryCreationTime;
    var constructionStackClone;
    var constructionFailedExceptionFactory;
    var instancer;
    var expectedInstance;
    var clazz;
    var error;

    beforeEach(function() {
        var $ = {}
        var typeChecker = TypeChecker($);
        var comparisonUtils = ComparisonUtils(typeChecker);
        var arrayUtils = ArrayUtils(comparisonUtils, $);

        namedLiteralConstructorParametersAtFactoryCreationTime = {}
        constructionStackClone = []
        expectedInstance = {}
        clazz = function() {}
        error = {}
        constructionFailedExceptionFactory = jasmine.createSpyObj(
            'constructionFailedExceptionFactory',
            ['createConstructionFailedException']
        );
        constructionFailedExceptionFactory.createConstructionFailedException.andReturn(error);

        instancer = jasmine.createSpyObj(
            'instancer',
            ['getOrCreateInstance']
        );

        factoryThatIsGeneratedByDependencyInjection = MagicFactory(
            clazz,
            arrayUtils,
            namedLiteralConstructorParametersAtFactoryCreationTime,
            constructionStackClone,
            constructionFailedExceptionFactory,
            instancer
        );
    });

    it('should be instantiable', function() {
        expect(factoryThatIsGeneratedByDependencyInjection).not.toBeUndefined();
    });

    describe('createInstanceUsingPartialConstructorParameters', function() {
        describe('when instancer does not have a problem instancing', function() {
            it('should construct instance. Constructor params are resolved first from function args, then from namedLiteralConstructorParametersAtFactoryCreationTime, and finally by falling back to the instancer implementation to resolve the rest.', function() {
                instancer.getOrCreateInstance.andReturn(expectedInstance);
                namedLiteralConstructorParametersAtFactoryCreationTime.param2='param2';
                namedLiteralConstructorParametersAtFactoryCreationTime.param4='thisParamShouldNotBeUsed';
                var constructorParametersKeyedByParamName = {
                    param3: 'param3'
                }
                var instance = factoryThatIsGeneratedByDependencyInjection.createInstanceUsingPartialConstructorParameters(constructorParametersKeyedByParamName);
                expect(instance).toBe(expectedInstance);
                expect(instancer.getOrCreateInstance).toHaveBeenCalledWith(clazz, {param2:'param2',param3:'param3',param4:'thisParamShouldNotBeUsed'}, constructionStackClone);
            });
        });
        describe('when instancer has a problem instancing', function() {
            it('should throw an exception containing information about the object graph being instanced (the constructionStackClone)', function() {
                var instancerError = {}
                instancer.getOrCreateInstance.andThrow(instancerError);
                expect(function() {
                    factoryThatIsGeneratedByDependencyInjection.createInstanceUsingPartialConstructorParameters({});
                }).toThrow(error);
                expect(
                    constructionFailedExceptionFactory.createConstructionFailedException
                ).toHaveBeenCalledWith(constructionStackClone, instancerError);
            });
        });
    });
});