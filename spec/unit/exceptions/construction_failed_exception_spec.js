var ConstructionFailedException = require('../../../lib/exceptions/construction_failed_exception');
var expect = require('chai').expect;

describe('ConstructionFailedException', function() {
    var constructionFailedException;
    var constructionStack;
    var cause;
    var stack1 = 'stack1';
    var stack2 = 'stack2';
    var stack3 = 'stack3';
    var causeMessage = 'cause message';

    beforeEach(function() {
        constructionStack = [stack1,stack2,stack3]
        cause = jasmine.createSpyObj('cause',['toString']);
        cause.toString.andReturn(causeMessage);
        constructionFailedException = ConstructionFailedException(constructionStack, cause);
    });

    it('should be instantiable', function() {
        expect(constructionFailedException).not.to.be.undefined();
    });

    describe('toString', function() {
        it('should contain the stack information', function() {
            var message = constructionFailedException.toString();
            expect(message).to.contain(stack1);
            expect(message).to.contain(stack2);
            expect(message).to.contain(stack3);
            expect(message).to.contain(causeMessage);
        });
    });
});