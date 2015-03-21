

describe('IOC4JS', function() {
    var dependencyInjection;
    var classContainer;
    var injectorConfig;
    var injector;
    var numberOfFInstantiations;
    var numberOfTransitiveSingletonClassInstantiations;
    var fakeInstance;
    var fakeTransitiveInstance;
    var fakeTransitiveSingletonInstance;

    beforeEach(function() {
        var $ = {}
        var comparisonUtils = ComparisonUtils($);
        var arrayUtils = ArrayUtils(comparisonUtils, $);
        var stringUtils = StringUtils(arrayUtils, $);
        var functionUtils = FunctionUtils(arrayUtils, stringUtils);
        dependencyInjection = DependencyInjection(arrayUtils, functionUtils, stringUtils);
        classContainer = {}
        numberOfFInstantiations = 0;
        numberOfTransitiveSingletonClassInstantiations = 0;
        fakeInstance = {}
        fakeTransitiveInstance = {}
        fakeTransitiveSingletonInstance = {}
        classContainer.TransitiveDependencyClass = function(c,e) {
            fakeTransitiveInstance.c=c;
            fakeTransitiveInstance.e=e;
            return fakeTransitiveInstance;
        }
        classContainer.SimpleClass = function(d, z) {
            return {
                d: d,
                z: z
            }
        }
        classContainer.ExampleClass = function(a, b, c, d, e, transitiveDependencyClass, f, transitiveSingletonClass, SimpleClass, simpleClassMagicFactory) {
            fakeInstance.a=a;
            fakeInstance.b=b;
            fakeInstance.c=c;
            fakeInstance.d=d;
            fakeInstance.e=e;
            fakeInstance.transitiveDependencyClass=transitiveDependencyClass;
            fakeInstance.f=f;
            fakeInstance.transitiveSingletonClass=transitiveSingletonClass;
            fakeInstance.testMagicFactory = function() {
                return simpleClassMagicFactory.createInstanceUsingPartialConstructorParameters({z:'z'});
            }
            fakeInstance.testMagicFactoryMethod = function() {
                return SimpleClass({z:'z'});
            }
            return fakeInstance;
        }
        classContainer.TransitiveSingletonClass = function(f, d) {
            numberOfTransitiveSingletonClassInstantiations++;
            fakeTransitiveSingletonInstance.f=f;
            fakeTransitiveSingletonInstance.d=d;
            fakeTransitiveSingletonInstance.doSomething = function() {
                return this.doSomethingElse();
            }
            fakeTransitiveSingletonInstance.doSomethingElse = function() {
                return 99;
            }
            return fakeTransitiveSingletonInstance;
        }
        injectorConfig = {
            classContainer: classContainer,
            literals: {
                b: 'bShouldBeOverriddenByImmediateValue',
                c: 'c'
            },
            factories: {
                d: function() {
                    return 'd';
                },
                e: function(d) {
                    return {
                        d: d
                    }
                },
                f: function(c, a) {
                    numberOfFInstantiations++;
                    return {
                        c: c,
                        a: a
                    }
                }
            },
            singletons: [
                'f',
                classContainer.TransitiveSingletonClass
            ]
        }
        injector = dependencyInjection.createInjector(injectorConfig);
    });

    it('should be instantiable', function() {
        expect(dependencyInjection).not.toBeUndefined();
    });

    describe('createInjector', function() {
        it('should create an injector', function() {
            expect(injector).not.toBeUndefined();
        });
    });

    describe('integration tests', function() {
        describe('when a fully featured instancing strategy is attempted', function() {
            it('should return the result of the constructor call', function() {

                var instance = injector.createInstanceUsingConstructorInjection(classContainer.ExampleClass, {a:5, b: 'b'});
                expect(instance).toBe(fakeInstance);
                expect(instance.a).toBe(5);
                expect(instance.b).toBe('b');
                expect(instance.c).toBe('c');
                expect(instance.d).toBe('d');
                expect(instance.e).toEqual({d:'d'});
                expect(instance.transitiveDependencyClass).toEqual(fakeTransitiveInstance);
                expect(fakeTransitiveInstance.c).toBe('c');
                expect(fakeTransitiveInstance.e).toEqual({d:'d'});
                expect(instance.f).toEqual({c:'c', a:5});
                expect(instance.transitiveSingletonClass).toEqual(fakeTransitiveSingletonInstance);
                expect(fakeTransitiveSingletonInstance.f).toEqual({c:'c', a:5});
                expect(fakeTransitiveSingletonInstance.d).toBe('d');

                var fakeTransitiveSingletonInstance2 = injector.createInstanceUsingConstructorInjection(classContainer.TransitiveSingletonClass, {c:'c', a:5});
                expect(numberOfFInstantiations).toBe(1);
                expect(numberOfTransitiveSingletonClassInstantiations).toBe(1);
                expect(fakeTransitiveSingletonInstance.doSomething()).toBe(99);
                expect(fakeTransitiveSingletonInstance2.doSomething()).toBe(99);

                expect(instance.testMagicFactory()).toEqual({d: 'd', z: 'z'});
                expect(instance.testMagicFactoryMethod()).toEqual({d: 'd', z: 'z'});
            });
        });
    });
});