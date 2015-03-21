module.exports = function ParameterResolverThatInstancesClassesWhoseNameMatchesParameter(reflection, instancer, stringUtils) {
    var INSTANCE_LABEL = ' [assumed class name matches param name]';
    return {
        canResolveParameter: function(constructorArgName) {
            var properCaseClassName = stringUtils.ToProperCase(constructorArgName);
            return reflection.classExists(properCaseClassName);
        },
        resolveParameter: function(constructorArgName, namedLiteralConstructorParams, constructionStack) {
            constructionStack.push(constructorArgName + INSTANCE_LABEL);
            var properCaseClassName = stringUtils.ToProperCase(constructorArgName);
            var classReference = reflection.getClass(properCaseClassName);
            var instance = instancer.getOrCreateInstance(classReference, namedLiteralConstructorParams, constructionStack);
            constructionStack.pop();
            return instance;
        }
    }
}