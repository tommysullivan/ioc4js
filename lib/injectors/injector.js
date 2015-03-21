module.exports = function Injector(
    arrayUtils,
    reflection,
    instancer,
    constructionFailedExceptionFactory
    ) {
    var CLASS_LABEL = ' [class]';
    return {
        createInstanceUsingConstructorInjection: function(clazz, namedLiteralConstructorParams, moreNamedParams, etc) {
            try {
                var setsOfNamedLiteralConstructorParams = arrayUtils.Slice(arrayUtils.ArgumentsToArray(arguments), 1);
                var allNamedLiteralConstructorParams = arrayUtils.Merge.apply(null, setsOfNamedLiteralConstructorParams);
                var constructionStack = [reflection.getClassName(clazz) + CLASS_LABEL]
                return instancer.getOrCreateInstance(clazz, allNamedLiteralConstructorParams, constructionStack);
            }
            catch(e) {
                throw constructionFailedExceptionFactory.createConstructionFailedException(constructionStack, e);
            }
        }
    }
}