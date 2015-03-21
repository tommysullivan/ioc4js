module.exports = function MagicFactoryCreator(arrayUtils, constructionFailedExceptionFactory, instancer, reflection) {
    var MAGIC_FACTORY_LABEL = ' [MagicFactory]';
    return {
        createMagicFactory: function(className, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack) {
            var clazz = reflection.getClass(className);
            var constructionStackClone = arrayUtils.CloneArray(constructionStack);
            constructionStackClone.push(className + MAGIC_FACTORY_LABEL);
            return MagicFactory(
                clazz,
                arrayUtils,
                namedLiteralConstructorParametersAtFactoryCreationTime,
                constructionStackClone,
                constructionFailedExceptionFactory,
                instancer
            );
        }
    }
}