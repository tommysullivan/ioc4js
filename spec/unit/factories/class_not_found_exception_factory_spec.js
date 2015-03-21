describe('ClassNotFoundExceptionFactory', function() {
    it('should create an instance of ClassNotFoundException', function() {
        var className = 'FakeClassName';
        var classNotFoundExceptionFactory = ClassNotFoundExceptionFactory();
        expect(classNotFoundExceptionFactory.createClassNotFoundException(className)).not.toBeUndefined();
    });
});