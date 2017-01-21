var chai = require('chai');
var expect = chai.expect;
var Box = require('./../../class/box.js');

describe('Box', function() {
  it('Box constructor', function() {
  	var data = {id:7,id_project:3,name:"Box test",order:2}
    var box = new Box(data);
    expect(box.id).to.equal(7);
    expect(box.id_project).to.equal(3);
    expect(box.name).to.equal("Box test");
    expect(box.order).to.equal(2);
  });
});