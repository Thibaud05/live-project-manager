var chai = require('chai');
var expect = chai.expect;
var ProjectUser = require('./../../js/ProjectUser.js');

describe('ProjectUser', function() {
	var data = {
		id_project :1,
		id_user : 2,
		right : 1
 	}

	it('constructor', function() {
		var projectUser = new ProjectUser(data);
		expect(projectUser.id_project).to.equal(1);
		expect(projectUser.id_user).to.equal(2);
		expect(projectUser.right).to.equal(1);
	});

	it('It\'s a visible user', function() {
		var projectUser = new ProjectUser(data);
		expect(projectUser.isVisibleUser()).to.equal(true);
	});

	it('It\'s not a visible user', function() {
		var projectUser = new ProjectUser(data);
		projectUser.right = 2
		expect(projectUser.isVisibleUser()).to.equal(false);
	});

});