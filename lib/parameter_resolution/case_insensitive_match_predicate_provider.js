module.exports = function CaseInsensitiveMatchPredicateProvider() {
    return {
        getPredicate: function(potentialMatchingString) {
            var uppercaseName = potentialMatchingString.toUpperCase();
            return function(potentialMatchName) {
                return potentialMatchName.toUpperCase()==uppercaseName;
            }
        }
    }
}