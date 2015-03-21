describe('Reflection', function() {
    var reflection;
    var classContainer;
    var classNotFoundExceptionFactory;
    var objectClass;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        var stringUtils = StringUtils(arrayUtils, $);
        classNotFoundExceptionFactory = jasmine.createSpyObj(
            'classNotFoundExceptionFactory',['createClassNotFoundException']
        );

        objectClass = {}

        classContainer = {
            SomeClass: function() {},
            SomeOtherClass: function() {}
        }
        reflection = Reflection(stringUtils, classNotFoundExceptionFactory, arrayUtils, classContainer, objectClass);
    });

    it('should be instantiable', function() {
        expect(reflection).not.toBeUndefined();
    });

    describe('getClass', function() {
        describe('when the class container contains a class constructor with the requested name', function() {
            it('should return that class constructor', function() {
                expect(reflection.getClass('SomeClass')).toBe(classContainer.SomeClass);
            });
        });
        describe('when the class container does not contain a class constructor with the requested name', function() {
            it('should throw a ClassNotFound exception', function() {
                var e = {}
                classNotFoundExceptionFactory.createClassNotFoundException.andReturn(e);
                expect(
                    function() {
                        reflection.getClass('ClassNotInContainer');
                    }
                ).toThrow(e);
            });
        });
    });

    describe('getClassName', function() {
        describe('when environment does not provide an implementation for Object.getOwnPropertyNames', function() {
            it('should return UNKNOWN_CLASS_NAME', function() {
                expect(reflection.getClassName(classContainer.SomeClass)).toEqual('UNKNOWN_CLASS');
            });
        });
        describe('when environment provides an implementation for Object.getOwnPropertyNames', function() {
            it('should return SomeClass', function() {
                objectClass.getOwnPropertyNames = Object.getOwnPropertyNames;
                expect(reflection.getClassName(classContainer.SomeClass)).toEqual('SomeClass');
            });
        });
    });
});