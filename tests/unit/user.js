var chai = require('chai');
var expect = chai.expect;
var User = require('./../../class/user.js');

describe('User', function() {
	var data = {
  		id:1,
  		id_group:3,
  		email:"test@mail.com",
  		password:"XfJ5i6bU",
  		firstName:"thibaud",
  		lastName:"granier",
  		lastConnexion:"20/01/2017",
  		autoConnexion:true,
  		selectedProject:2
 	}
 	var socketId = "Ds6D45d6"
 	global = {config:{url:"baseUrl"}}

	it('constructor', function() {
		var user = new User(data);
		expect(user.id).to.equal(1);
		expect(user.email).to.equal("test@mail.com");
		expect(user.password).to.equal("XfJ5i6bU");
		expect(user.firstName).to.equal("Thibaud");
		expect(user.lastName).to.equal("GRANIER");
		expect(user.lastConnexion).to.equal("20/01/2017");
		expect(user.autoConnexion).to.equal(true);
		expect(user.selectedProject).to.equal(2);
		expect(user.logged).to.equal(false);
		expect(user.sockets).to.deep.equal({});
	});

	it('getFullName', function() {
		var user = new User(data);
		expect(user.getFullName()).to.equal("Thibaud GRANIER");
	});

	it('getAvatard 32px', function() {
		var user = new User(data);
		expect(user.getAvatar(32)).to.equal('<img class="img-circle avatar avatar1" src="img/user/1.jpg" width="32" height="32" />');
	});

	it('getImg', function() {
		var user = new User(data);
		expect(user.getImg()).to.equal('baseUrl/img/user/1.jpg');
	});

	

	it('addSocket ' + socketId, function() {
		var user = new User(data);
		user.addSocket(socketId)
		expect(user.sockets[socketId]).to.equal(1);
	});

	it('delSocket', function() {
		var user = new User(data);
		user.addSocket(socketId)
		user.delSocket(socketId)
		expect(user.sockets[socketId]).to.equal(undefined);
	});

	it('haveSocket', function() {
		var user = new User(data);
		user.addSocket(socketId)
		expect(user.haveSocket()).to.equal(true);
	});

	it('haven\'t Socket', function() {
		var user = new User(data);
		user.addSocket(socketId)
		user.delSocket(socketId)
		expect(user.haveSocket()).to.equal(false);
	});

});