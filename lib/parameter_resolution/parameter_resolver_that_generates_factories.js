module.exports = function ParameterResolverThatGeneratesFactories(magicFactoryCreator, stringUtils) {
    return {
        canResolveParameter: function(constructorArgName) {
            return constructorArgName.indexOf('MagicFactory')!=-1;
        },
        resolveParameter: function(constructorArgName, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack) {
            var className = constructorArgName.split('MagicFactory')[0];
            var properCaseClassName = stringUtils.ToProperCase(className);
            var magicFactory = magicFactoryCreator.createMagicFactory(properCaseClassName, namedLiteralConstructorParametersAtFactoryCreationTime, constructionStack);
            return magicFactory;
        }
    }
}