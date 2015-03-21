var ClassNotFoundException = require('../../../lib/exceptions/class_not_found_exception');
var expect = require('chai').expect;

describe('ClassNotFoundException', function() {
    it('should be instantiable', function() {
        var className = 'FakeClassName';
        var classNotFoundException = ClassNotFoundException(className);
        expect(classNotFoundException).to.exist;
        expect(classNotFoundException).to.have.property('message').that.is.a('string');
    });
});