module.exports = function SingletonInstancer(arrayUtils, singletonClasses, singletonInstanceCollection, onDemandInstancer, proxiedInstanceFactory) {
    return {
        shouldBeSingleton: function(clazz) {
            return arrayUtils.ContainsReference(singletonClasses, clazz);
        },
        getOrCreateInstance: function(clazz, namedLiteralConstructorParams, constructionStack) {
            if(singletonInstanceCollection.hasSingletonInstance(clazz)) {
                return singletonInstanceCollection.getSingletonInstance(clazz);
            }
            //TODO: Add information about singleton instantiation to the constructionStack
            var proxiedInstance = proxiedInstanceFactory.createProxiedInstance();
            var proxy = proxiedInstance.getProxy();
            singletonInstanceCollection.registerSingletonInstance(proxy, clazz);
            var instance = onDemandInstancer.getOrCreateInstance(clazz, namedLiteralConstructorParams, constructionStack);
            proxiedInstance.setRealInstance(instance);
            return proxy;
        }
    }
}