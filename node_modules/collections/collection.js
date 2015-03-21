module.exports = function Collection(internalArray) {
    return {
        toArray:function(){
            var copyOfArray = internalArray.slice(0);
            return copyOfArray;
        },
        add:function(itemToAdd){
            internalArray.push(itemToAdd);
        },
        clone:function(){
            var independentInternalArray = this.toArray();
            var newIndependentInstance = Collection(independentInternalArray); 
            return newIndependentInstance;
        },
        get:function(indx){
            if (indx < internalArray.length && indx >= 0 && indx === (indx|0)) return internalArray[indx];
            throw "This subscript " + indx + " is out of range, sweetie!!";
        },
        hasIndex:function(indx){
            return indx < internalArray.length && indx >= 0 && indx === (indx|0);
        },
        map:function(mapperFunction){
            var internalArrayForNewCollection = [];
            this.forEach(function(currentItem, currentIndex, collection) {
                internalArrayForNewCollection[currentIndex]=mapperFunction(currentItem, currentIndex, collection);    
            });
            return Collection(internalArrayForNewCollection);
        },
        remove:function(itemToRemove) {
            for(var j in internalArray) { 
                 if (internalArray[j]==itemToRemove) internalArray.splice(j,1);
            }
        },
        firstIndexOf:function(soughtItem){
          var indexToBeReturned=-1;  
          this.forEach(function(currentItem,currentIndex) {
              if (currentItem==soughtItem){ 
                indexToBeReturned=currentIndex;
                return false;
              }
          });
          if (indexToBeReturned==-1) throw 'Error';
          return indexToBeReturned;
        },
        addCollection: function(collection){
            internalArray=internalArray.concat(collection.toArray());
        },
        forEach: function(functionToCallForEachItem) {
            var arrayOfItemsToLoopOver = this.toArray();
            for (var currentIndex=0; currentIndex<arrayOfItemsToLoopOver.length; currentIndex++){
                var value = arrayOfItemsToLoopOver[currentIndex];
                var shouldBreak = functionToCallForEachItem(value,currentIndex,this);
                if (shouldBreak===false) return false;
            }
            return true;
        },
        removeCollection: function(collectionOfItemsToRemove){
            var thisCollection = this; //needed because "this" within the function below will be different!
            collectionOfItemsToRemove.forEach(function(itemToRemove) {
                thisCollection.remove(itemToRemove);
            });
        },
        filter: function(predicateFunction) {
            var filteredArray = [];
            function doThisForEachItem(currentItem){
                 if (predicateFunction(currentItem)) {filteredArray.push(currentItem)};
            }
            this.forEach(doThisForEachItem);
            return Collection(filteredArray);
        },
        contains: function(soughtElement){
            function doThisForEachItem(currentItem,index,collection){
               if(currentItem === soughtElement) return false;
            }
            return !this.forEach(doThisForEachItem);
        },
        containsAny: function(collectionOfSoughtItems) {
            return this.any(function(item) {
                 return collectionOfSoughtItems.contains(item);
            });
        },
        length: function() {
            return internalArray.length;
        },
        isEmpty: function() {
            return this.length()==0;
        },
        first: function() {
            return this.get(0);
        },
        unique: function() {
            var uniqueCollection = Collection([]);
            this.forEach(function(element) {
                if(!uniqueCollection.contains(element)) uniqueCollection.add(element);
            });
            return uniqueCollection;
        },
        equals: function(other) {
              
        },
        join: function(delimiter) {
            return internalArray.join(delimiter);
        },
        toString: function() {
            return '['+internalArray.join(',')+']';
        },
        fold: function(operator, identityForOperation) {
            var fold = identityForOperation;
            this.forEach(function(item) {
                fold = operator(fold, item); 
            });
            return fold;
        },
        any: function(predicate) {
            return !this.forEach(function() { return !predicate.apply(null, arguments); });
        },
        all: function(predicate) {
            return this.forEach(predicate);
        }
    }
}