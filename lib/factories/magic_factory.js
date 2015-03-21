module.exports = function MagicFactory(clazz, arrayUtils, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStackClone, constructionFailedExceptionFactory, instancer) {
    return {
        createInstanceUsingPartialConstructorParameters: function(constructorParametersKeyedByParamName) {
            try {
                constructorParametersKeyedByParamName = constructorParametersKeyedByParamName || {}
                return instancer.getOrCreateInstance(
                    clazz,
                    arrayUtils.Merge(
                        namedLiteralConstructorParametersAtFactoryCreationTime,
                        constructorParametersKeyedByParamName
                    ),
                    constructionStackClone
                );
            }
            catch(e) {
                throw constructionFailedExceptionFactory.createConstructionFailedException(constructionStackClone, e);
            }
        }
    }
}