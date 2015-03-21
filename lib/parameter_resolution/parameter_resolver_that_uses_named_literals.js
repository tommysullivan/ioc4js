module.exports =  function ParameterResolverThatUsesNamedLiterals(arrayUtils, caseInsensitiveMatchPredicateProvider, configuredNamedLiteralConstructorParameters) {
    function getMatchingLiteralName(constructorArgName, allNamedLiteralConstructorParameters) {
        var matchPredicate = caseInsensitiveMatchPredicateProvider.getPredicate(constructorArgName);
        var literalNames = arrayUtils.Keys(allNamedLiteralConstructorParameters);
        return arrayUtils.FirstMatch(literalNames, matchPredicate);
    }
    return {
        canResolveParameter: function(constructorArgName, namedLiteralConstructorParameters) {
            var allNamedLiteralConstructorParameters = arrayUtils.Merge(configuredNamedLiteralConstructorParameters, namedLiteralConstructorParameters);
            return getMatchingLiteralName(constructorArgName, allNamedLiteralConstructorParameters)!=undefined;
        },
        resolveParameter: function(constructorArgName, namedLiteralConstructorParameters, constructionStack) {
            var allNamedLiteralConstructorParameters = arrayUtils.Merge(configuredNamedLiteralConstructorParameters, namedLiteralConstructorParameters);
            var matchingLiteralName = getMatchingLiteralName(constructorArgName, allNamedLiteralConstructorParameters);
            return allNamedLiteralConstructorParameters[matchingLiteralName];
        }
    }
}