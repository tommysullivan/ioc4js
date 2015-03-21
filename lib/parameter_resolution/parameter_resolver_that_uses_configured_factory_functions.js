module.exports = function ParameterResolverThatUsesConfiguredFactoryFunctions(arrayUtils, configuredFactoryFunctionsKeyedByParamName, caseInsensitiveMatchPredicateProvider, instancer) {
    var CONFIGURED_FACTORY_LABEL = ' [configured factory]';

    function getMatchingFactoryName(constructorArgName) {
        var matchPredicate = caseInsensitiveMatchPredicateProvider.getPredicate(constructorArgName);
        return arrayUtils.FirstMatch(arrayUtils.Keys(configuredFactoryFunctionsKeyedByParamName), matchPredicate);
    }

    return {
        canResolveParameter: function(constructorArgName) {
            return getMatchingFactoryName(constructorArgName)!=undefined;
        },
        resolveParameter: function(constructorArgName, namedLiteralConstructorParameters, constructionStack) {
            var matchingFactoryName = getMatchingFactoryName(constructorArgName);
            constructionStack.push(constructorArgName + CONFIGURED_FACTORY_LABEL);
            var configuredFactory = configuredFactoryFunctionsKeyedByParamName[matchingFactoryName];
            var instance = instancer.getOrCreateInstance(configuredFactory, namedLiteralConstructorParameters, constructionStack);
            constructionStack.pop();
            return instance;
        }
    }
}