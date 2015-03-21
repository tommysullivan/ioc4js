var ClassNotFoundExceptionFactory = require('./exceptions/class_not_found_exception');
var ConstructionFailedExceptionFactory = require('./exceptions/construction_failed_exception');

var Reflection = require('./parameter_resolution/reflection');
var CaseInsensitiveMatchPredicateProvider = require('./parameter_resolution/case_insensitive_match_predicate_provider');
var ParameterResolver = require('./parameter_resolution/parameter_resolver');
var ParameterResolverThatGeneratesFactories = require('./parameter_resolution/parameter_resolver_that_generates_factories');
var ParameterResolverThatGeneratesFactoryMethods = require('./parameter_resolution/parameter_resolver_that_generates_factory_methods');
var ParameterResolverThatInstancesClassesWhoseNameMatchesParameter = require('./parameter_resolution/parameter_resolver_that_instances_classes_whose_name_matches_parameter');
var ParameterResolverThatUsesConfiguredFactoryFunctions = require('./parameter_resolution/parameter_resolver_that_uses_configured_factory_functions');
var ParameterResolverThatUsesNamedLiterals = require('./parameter_resolution/parameter_resolver_that_uses_named_literals');

module.exports = function IOC4JS(collections) {
    return {
        createInjector: function(injectorConfig) {
            var singletonConfigs = injectorConfig.singletons == null ? [] : injectorConfig.singletons;
            var singletonClasses = singletonConfigs.map(function(singleton) {
                if(typeof(singleton)=='string') return injectorConfig.factories[singleton];
                if(typeof(singleton)=='function') return singleton;
            });

            var configuredNamedLiteralConstructorParameters = injectorConfig.literals == null ? {} : injectorConfig.literals;
            var configuredFactoryFunctionsKeyedByParamName = injectorConfig.factories == null ? {} : injectorConfig.factories;

            var objectClass = Object;
            var classContainer = injectorConfig.classContainer == null ? window : injectorConfig.classContainer;
            var classNotFoundExceptionFactory = ClassNotFoundExceptionFactory();
            var constructionFailedExceptionFactory = ConstructionFailedExceptionFactory();
            var reflection = Reflection(stringUtils, classNotFoundExceptionFactory, arrayUtils, classContainer, objectClass);
            var caseInsensitiveMatchPredicateProvider = CaseInsensitiveMatchPredicateProvider();
            var parameterResolverThatUsesNamedLiterals = ParameterResolverThatUsesNamedLiterals(arrayUtils, caseInsensitiveMatchPredicateProvider, configuredNamedLiteralConstructorParameters);
            var instancerProxy = {};
            var parameterResolverThatUsesConfiguredFactoryFunctions = ParameterResolverThatUsesConfiguredFactoryFunctions(arrayUtils, configuredFactoryFunctionsKeyedByParamName, caseInsensitiveMatchPredicateProvider, instancerProxy);
            var magicFactoryCreator = MagicFactoryCreator(arrayUtils, constructionFailedExceptionFactory, instancerProxy, reflection);
            var reflectionForConfiguredFactories = Reflection(stringUtils, classNotFoundExceptionFactory, arrayUtils, configuredFactoryFunctionsKeyedByParamName, objectClass);
            var parameterResolverThatGeneratesFactories = ParameterResolverThatGeneratesFactories(magicFactoryCreator, stringUtils);
            var parameterResolverThatGeneratesFactoryMethods = ParameterResolverThatGeneratesFactoryMethods(magicFactoryCreator);
            var parameterResolverThatInstancesClassesWhoseNameMatchesParameter = ParameterResolverThatInstancesClassesWhoseNameMatchesParameter(reflection, instancerProxy, stringUtils);
            var parameterResolversInIncreasingPrecedenceOrder = [
                parameterResolverThatUsesNamedLiterals,
                parameterResolverThatUsesConfiguredFactoryFunctions,
                parameterResolverThatGeneratesFactories,
                parameterResolverThatGeneratesFactoryMethods,
                parameterResolverThatInstancesClassesWhoseNameMatchesParameter
            ]
            var parameterResolver = ParameterResolver(functionUtils, arrayUtils, parameterResolversInIncreasingPrecedenceOrder);
            var onDemandInstancer = OnDemandInstancer(parameterResolver);
            var singletonInstanceFactory = SingletonInstanceFactory();
            var singletonInstanceCollection = SingletonInstanceCollection(arrayUtils, singletonInstanceFactory);
            var proxiedInstanceFactory = ProxiedInstanceFactory();
            var singletonInstancer = SingletonInstancer(arrayUtils, singletonClasses, singletonInstanceCollection, onDemandInstancer, proxiedInstanceFactory);
            var instancer = Instancer(singletonInstancer, onDemandInstancer);
            instancerProxy.getOrCreateInstance = instancer.getOrCreateInstance;
            return Injector(
                arrayUtils,
                reflection,
                instancer,
                constructionFailedExceptionFactory
            );
        }
    }
}