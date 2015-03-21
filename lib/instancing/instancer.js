module.exports = function Instancer(singletonInstancer, onDemandInstancer) {
    return {
        getOrCreateInstance: function(clazz, namedLiteralConstructorParams, constructionStack) {
            var properInstancer = singletonInstancer.shouldBeSingleton(clazz)
                ? singletonInstancer
                : onDemandInstancer;
            return properInstancer.getOrCreateInstance(clazz, namedLiteralConstructorParams, constructionStack);
        }
    }
}