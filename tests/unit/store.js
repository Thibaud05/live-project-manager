var chai = require('chai');
var expect = chai.expect;
var store = require('./../../class/Store.js');

describe('Store', function() {
  it('setData', function() {
    /*
    store.taskTypes      = []
    store.releases       = []
    store.users          = []
    store.tasks          = []
    store.tasks_files    = []
    store.tasks_links    = []
    store.tasks_messages = []
    store.projects       = []
    store.projects_user  = []
    store.box            = []
*/
   // expect(box.id).to.equal(7);
    expect(store.box).to.be.empty;
  });
});