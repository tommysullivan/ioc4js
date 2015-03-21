describe('ConstructionFailedExeptionFactory', function() {
    it('should produce an exception when called', function() {
        var constructionFailedExceptionFactory = ConstructionFailedExceptionFactory();
        var constructionStackClone = ['stack','stack2']
        var e = new Error('pretend error');
        expect(constructionFailedExceptionFactory.createConstructionFailedException(constructionStackClone, e)).not.toBeUndefined();
    });
});