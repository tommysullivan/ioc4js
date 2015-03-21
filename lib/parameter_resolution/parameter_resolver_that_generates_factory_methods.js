module.exports = function ParameterResolverThatGeneratesFactoryMethods(magicFactoryCreator) {
    var AUTO_FACTORY_LABEL = ' [MagicFactoryMethod]';
    return {
        canResolveParameter: function(constructorArgName) {
            var firstChar = constructorArgName.charAt(0);
            return firstChar==firstChar.toUpperCase();
        },
        resolveParameter: function(constructorArgName, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack) {
            var className = constructorArgName;
            var magicFactory = magicFactoryCreator.createMagicFactory(className, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack);
            return magicFactory.createInstanceUsingPartialConstructorParameters;
        }
    }
}