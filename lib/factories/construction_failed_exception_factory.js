module.exports = function ConstructionFailedExceptionFactory() {
    return {
        createConstructionFailedException: function(constructionStackClone, e) {
            return ConstructionFailedException(constructionStackClone, e);
        }
    }
}