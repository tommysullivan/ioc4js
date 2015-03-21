describe('ProxiedInstanceFactory', function() {
    it('should return a proxied instance', function() {
        expect(ProxiedInstanceFactory().createProxiedInstance()).not.toBeUndefined();
    })
});