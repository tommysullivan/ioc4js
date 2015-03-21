module.exports = function SingletonInstanceCollection(arrayUtils, singletonInstanceFactory) {
    var singletonInstances = []
    return {
        hasSingletonInstance: function(clazz) {
            return arrayUtils.PredicateIsTrueForAtLeastOneItem(singletonInstances, function(singletonInstance) {
                return singletonInstance.clazz()==clazz;
            });
        },
        registerSingletonInstance: function(instance, clazz) {
            if(this.hasSingletonInstance(clazz)) throw new Error('Attempted to register an existing singleton');
            singletonInstances.push(singletonInstanceFactory.createSingletonInstance(instance, clazz));
        },
        getSingletonInstance: function(clazz) {
            return arrayUtils.FirstMatch(singletonInstances, function(singletonInstance) {
                return singletonInstance.clazz()==clazz;
            }).instance();
        }
    }
}