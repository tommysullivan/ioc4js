module.exports = function ProxiedInstanceFactory() {
    return {
        createProxiedInstance: function() {
            return ProxiedInstance();
        }
    }
}