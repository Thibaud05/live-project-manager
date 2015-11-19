
/*
    TEST TASK MANAGER OBJECT
*/
QUnit.test( "Tasks manager tests", function( assert ) {
  assert.ok( new tasksManager(), "Create a new tasksManager" );
  var testTaskManager = new tasksManager()
});




/*
    TEST TASK OBJECT
*/
QUnit.test( "Task tests", function( assert ) {
    var obj = {
        "id" : 1,
        "id_type":1,
        "id_user" :"",
        "day": "2015-11-19",
        "creationDate" :"2015-11-16 13:49:12.000000",
        "creationUser" :1,
        "accountableUser":1,
        "updateDate" :"2015-11-16 13:49:12.000000",
        "title": "Test title",
        "description" :"Test description",
        "priority": 1,
        "valid" :0
    };
  assert.ok( new task(obj), "Create a new task" );
  var testTask = new task(obj)
});

/*
    TEST USER OBJECT
*/
QUnit.test( "User tests", function( assert ) {
    var obj = {"id": 1,"firstname": "thibaud","lastname": "granier","level": 1}
    assert.ok( new user(obj), "Create a new user" );
    assert.equal( new user(obj).getName(),"thibaud granier", "User full Name" );
});

/*
    TEST FILE OBJECT
*/
QUnit.test( "File tests", function( assert ) {
    tasksManager = {"fullUrl": "testUrl"};
    var obj = {"id": 1,"id_task": 1,"title": "Test_file","type": "jpg"}
    assert.ok( new file(obj), "Create a new file" );

    var fileTest = new file(obj)
    assert.ok( fileTest.buildUrl(), "File build url" );
    assert.equal( fileTest.url,"testUrl/server/files/Test_file", "file url" );
    assert.equal( fileTest.thumbnailUrl,"testUrl/server/files/thumbnail/Test_file", "file thumbnailUrl" );

    var htmlResult = '<div class="file">';
    htmlResult += '<a class="content" target="_blank" href="testUrl/server/files/Test_file" >jpg</a>';
    htmlResult += 'Test_file <a href="#" fid="1" class="removeFile" >X</a></div>';
    assert.equal( fileTest.display(),htmlResult, "file display" );

    fileTest.type = "image/jpeg"
    assert.equal( fileTest.getThumbnail(),'<img src="testUrl/server/files/thumbnail/Test_file" />', "jpeg file getThumbnail" );

    fileTest.type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    assert.equal( fileTest.getThumbnail(),'<img src="testUrl/img/ico/doc.png" />', "doc file getThumbnail" );

    fileTest.type = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    assert.equal( fileTest.getThumbnail(),'<img src="testUrl/img/ico/ppt.png" />', "ppt file getThumbnail" );

    fileTest.type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    assert.equal( fileTest.getThumbnail(),'<img src="testUrl/img/ico/xls.png" />', "xls file getThumbnail" );
    
});
