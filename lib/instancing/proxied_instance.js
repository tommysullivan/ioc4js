module.exports = function ProxiedInstance() {
    var proxy = {}
    return {
        getProxy: function() {
            return proxy;
        },
        setRealInstance: function(realInstance) {
            if(typeof(realInstance)!='object') throw new Error('Unproxyable instance - only objects may be proxied - instance: '+realInstance);
            for(var member in realInstance) {
                if(typeof(member)=='function') {
                    proxy[member] = function() {
                        return realInstance[member].apply(realInstance, arguments);
                    }
                } else {
                    proxy[member] = realInstance[member];
                }
            }
        }
    }
}