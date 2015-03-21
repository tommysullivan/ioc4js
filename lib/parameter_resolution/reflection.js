module.exports = function Reflection(stringUtils, classNotFoundExceptionFactory, arrayUtils, classContainer, objectClass) {
    var UNKNOWN_CLASS_NAME = 'UNKNOWN_CLASS';
    return {
        classExists: function(className) {
            return Object.prototype.hasOwnProperty.call(classContainer, className);
        },
        getClass: function(className) {
            if(!this.classExists(className)) throw classNotFoundExceptionFactory.createClassNotFoundException(className);
            return classContainer[className];
        },
        getClassName: function(classReference) {
            if(!this.canGetGlobalVariableNames()) return UNKNOWN_CLASS_NAME;
            var classNameThatMatchesConstructorArgName = arrayUtils.FirstMatch(this.getGlobalVariableNames(), function(globalVariableName) {
                return classContainer[globalVariableName]==classReference;
            });
            return classNameThatMatchesConstructorArgName == null
                ? UNKNOWN_CLASS_NAME
                : classNameThatMatchesConstructorArgName
        },
        getGlobalVariableNames: function() {
            return objectClass.getOwnPropertyNames(classContainer);
        },
        canGetGlobalVariableNames: function() {
            return objectClass!=null && objectClass.getOwnPropertyNames!=null;
        }
    }
}