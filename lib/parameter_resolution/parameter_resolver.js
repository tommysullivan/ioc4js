module.exports = function ParameterResolver(functionUtils, arrayUtils, parameterResolversInIncreasingPrecedenceOrder) {
    return {
        resolveParameter: function(constructorArgName, namedLiteralConstructorParameters, constructionStack) {
            var resolvedValue;
            var gotThroughEntireList = arrayUtils.ForEach(parameterResolversInIncreasingPrecedenceOrder, function(parameterResolver) {
                if(parameterResolver.canResolveParameter(constructorArgName, namedLiteralConstructorParameters)) {
                    resolvedValue = parameterResolver.resolveParameter(
                        constructorArgName, namedLiteralConstructorParameters, constructionStack
                    );
                    return false;
                }
            });
            if(gotThroughEntireList) {
                throw new Error("unable to resolve parameter "+constructorArgName)
            }
            return resolvedValue;
        },
        resolveParameters: function(clazz, namedLiteralConstructorParams, constructionStack) {
            var constructorArgNames = functionUtils.GetFunctionArgNames(clazz);
            var thisParameterResolver = this;
            var constructorArgValues = arrayUtils.Map(
                constructorArgNames,
                function(constructorArgName) {
                    return thisParameterResolver.resolveParameter(constructorArgName, namedLiteralConstructorParams, constructionStack);
                }
            );
            return constructorArgValues;
        }
    }
}