var chai = require('chai');
var expect = chai.expect;
var Store = require('./../../class/store.js');

describe('Store', function() {
  it('setData', function() {
    var store = new Store();
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

   // expect(box.id).to.equal(7);
    expect(box.id_project).to.equal(3);
  });
});