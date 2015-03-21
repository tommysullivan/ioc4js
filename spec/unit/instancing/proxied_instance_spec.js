describe('ProxiedInstance', function() {
    var proxiedInstance;

    beforeEach(function() {
        proxiedInstance = ProxiedInstance();
    });

    it('should be instantiable', function() {
        expect(proxiedInstance).not.toBeUndefined();
    });

    describe('getProxy', function() {
        it('should return an object that, after proxy is set, behaves like the actual implementation', function() {
            var proxy = proxiedInstance.getProxy();
            expect(function() {
                proxy.doMethod()
            }).toThrow();
            var realInstance = {
                doMethod: function() {
                    return this.methodThatTestsTheThisIsProperlyScopedWhenCalledViaProxy();
                },
                methodThatTestsTheThisIsProperlyScopedWhenCalledViaProxy: function() {
                    return 5;
                }
            }
            proxiedInstance.setRealInstance(realInstance);
            expect(proxy.doMethod()).toBe(5);
        });
    });

    describe('setProxy', function() {
        describe('when a non-reference type is set', function() {
            it('should throw an error', function() {
                expect(function() {
                    proxiedInstance.setRealInstance(5);
                }).toThrow();
            });
        });
    });
})