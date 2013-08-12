assert = require("assert");
replay = require("replay");
OKC = require('../index');

replay.fixtures = __dirname + "/fixtures";
// replay.mode = 'replay'

describe('getting an extended profile', function(){
  var okc, person;

  before(function(done){
    okc = new OKC('thetrek', 'notmyactualpasswordyo');
    okc.connect(function(err, resp, body){
      okc.profileFor('captainplanet04', function(data){
        person = data;
        done();
      });
    });
  });

  it("includes age", function(){
    assert.equal(person.age, 26);
  });

  it("includes match", function(){
    assert.equal(person.match, 84);
  });

  it("includes friend", function(){
    assert.equal(person.friend, 67);
  });

  it("includes enemy", function(){
    assert.equal(person.enemy, 16);
  });

  it("includes age", function(){
    assert.equal(person.age, 26);
  });

  it("includes sex", function(){
    assert.equal(person.sex, "M");
  });

  it("includes orientation", function(){
    assert.equal(person.orientation, "Gay");
  });

  it("includes single", function(){
    assert.equal(person.single, "Single");
  });

  it("includes location", function(){
    assert.equal(person.location, "Chicago, Illinois");
  });

  it("includes thumbUrls", function(){
    var thumbs = [ 
      'http://ak3.okccdn.com/php/load_okc_image.php/images/160x160/160x160/0x0/509x509/2/3692483468293522536.jpeg',
      'http://ak0.okccdn.com/php/load_okc_image.php/images/160x160/160x160/0x12/525x537/2/17350075411779028264.jpeg',
      'http://ak1.okccdn.com/php/load_okc_image.php/images/160x160/160x160/795x30/1293x528/2/7083764749633924682.jpeg'
    ];

    assert.deepEqual(person.thumbUrls, thumbs);
  });
})
