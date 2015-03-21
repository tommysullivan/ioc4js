describe('MagicFactoryCreator', function() {
    var magicFactoryCreator;
    var reflection;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils=ArrayUtils(comparisonUtils, $);
        var constructionFailedExceptionFactory={}
        var instancer={}
        reflection = jasmine.createSpyObj('reflection',['getClass']);
        magicFactoryCreator = MagicFactoryCreator(
            arrayUtils, constructionFailedExceptionFactory, instancer, reflection
        );
    });

    it('is instantiable', function() {
        expect(magicFactoryCreator).not.toBeUndefined();
    });

    describe('createMagicFactory', function() {
        it('creates instances of MagicFactory', function() {
            var className = 'FakeClassName'
            var namedLiteralConstructorParametersAtFactoryCreationTime = {}
            var constructionStack = []

            var clazz = function() {}
            reflection.getClass.andReturn(clazz);
            var result = magicFactoryCreator.createMagicFactory(
                className, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack
            );
            expect(result).not.toBeUndefined();
        });
    });
});