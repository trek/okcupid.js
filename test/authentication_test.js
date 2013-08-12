assert = require("assert");
replay = require("replay");
OKC = require('../index');

replay.fixtures = __dirname + "/fixtures";
// replay.mode = 'replay'

describe('authentication', function(){
  it("sets connected to true", function(done){
    var okc = new OKC('thetrek', 'notmyactualpasswordyo');

    okc.connect(function(err, resp, body){
      assert(okc.connected, true);
      done();
    });

  });
})
