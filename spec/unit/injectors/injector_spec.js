describe("Injector", function() {
    var injector;
    var reflection;
    var instancer;
    var constructionFailedExceptionFactory;
    var classNotFoundException;
    var classInstance;
    var FakeClassToInject = function() {}

    beforeEach(function() {
        var $ = {}
        var typeChecker = TypeChecker($);
        var comparisonUtils = ComparisonUtils(typeChecker);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        var stringUtils = new StringUtils(arrayUtils, $);

        classInstance = {}
        classNotFoundException = {}
        reflection = jasmine.createSpyObj('reflection', ['getClassName']);
        instancer = jasmine.createSpyObj('instancer', ['getOrCreateInstance']);
        constructionFailedExceptionFactory = jasmine.createSpyObj('instancer', ['createConstructionFailedException']);
        constructionFailedExceptionFactory.createConstructionFailedException.andReturn(classNotFoundException);
        injector = Injector(
            arrayUtils,
            reflection,
            instancer,
            constructionFailedExceptionFactory
        );
    });

    it('should be instantiable', function() {
        expect(injector).not.toBeUndefined();
    });


    describe('createInstanceUsingConstructorInjection', function() {
        describe('when attempting to instance a class that is not defined', function() {
            it("should throw an exception", function() {
                reflection.getClassName.andThrow(classNotFoundException);
                expect(
                    function() {
                        var ClassThatIsNotDefined = undefined;
                        injector.createInstanceUsingConstructorInjection(ClassThatIsNotDefined);
                    }
                ).toThrow();
                expect(
                    constructionFailedExceptionFactory.createConstructionFailedException
                ).toHaveBeenCalledWith(undefined, classNotFoundException);
            });
        });
        describe('when attempting to instance a class that is defined', function() {
            it('should ask the instancer to construct it using common and immediate local constructor params, where immediate params of the same name override common params, and later immediate params override previous immediate params', function() {
                reflection.getClassName.andReturn('FakeClassToInject');
                instancer.getOrCreateInstance.andReturn(classInstance);
                var namedLiteralConstructorParams = {b: 'NewB', d: 'D', e: 'E'}
                var moreNamedLiteralConstructorParams = { e: 'NewE', f: 'F'}
                expect(
                    injector.createInstanceUsingConstructorInjection(
                        FakeClassToInject,
                        namedLiteralConstructorParams,
                        moreNamedLiteralConstructorParams
                    )
                ).toBe(classInstance);
                var expectedNamedLiteralConstructorParams = {
                    b: 'NewB',
                    d: 'D',
                    e: 'NewE',
                    f: 'F'
                }
                expect(instancer.getOrCreateInstance).toHaveBeenCalledWith(
                    FakeClassToInject,
                    expectedNamedLiteralConstructorParams,
                    jasmine.any(Array)
                );
            });
        });
    });
});