module.exports = function ConstructionFailedException(constructionStack, cause) {
    return {
        toString: function() {
            return 'Injector: Failure attempting to construct instance tree: '+constructionStack.join(' -> ')+' Cause: '+cause.toString();
        }
    }
}