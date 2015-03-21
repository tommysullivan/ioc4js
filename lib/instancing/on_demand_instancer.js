module.exports = function OnDemandInstancer(parameterResolver) {
    return {
        getOrCreateInstance: function(clazz, namedLiteralConstructorParams, constructionStack) {
            var constructorArgValues = parameterResolver.resolveParameters(
                clazz,
                namedLiteralConstructorParams,
                constructionStack
            );
            return clazz.apply(null, constructorArgValues);
        }
    }
}