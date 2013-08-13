//   Hey there.
//           ,d88b.d88b,
//           88888888888
//           `Y8888888Y'
//             `Y888Y'
//               `Y'       - trek
//
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var Search = require('lib/search');

OKCupid = function(username, password){
  this.username = username;
  this.password = password;
  this.connected = false;
}


OKCupid.prototype = {
  connect: function(cbk){
    var self = this;
    request({
      url: "https://www.okcupid.com/login",
      method: 'post',
      followAllRedirects: true,
      form: {
        username: this.username,
        password: this.password
      },
      jar: true,
      headers: { 
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36"
      }
    }, function(){
      self.connected = true;
      cbk.apply(this, arguments);
    })
  },
  profileFor: function(username, cbk){
    request({
      url: util.format('http://www.okcupid.com/profile/%s', username),
      jar: true,
      headers: { 
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36"
      }
    }, function(err, resp, body){
      var $ = cheerio.load(body);
      var percentages = $("#percentages");
      var match = parseInt(percentages.find("span.match").text(), 10);
      var friend = parseInt(percentages.find("span.friend").text(), 10);
      var enemy = parseInt(percentages.find("span.enemy").text(), 10);

      var basic = $("#aso_loc");
      var age   = parseInt(basic.find("#ajax_age").text(), 10);
      var sex   = basic.find("#ajax_gender").text();
      var orientation = basic.find('#ajax_orientation').text();
      var single = basic.find('#ajax_status').text();
      var location = basic.find('#ajax_location').text()

      var thumbUrls = $('#profile_thumbs img').map(function(index, element){
        return $(element).attr('src');
      });

      var profile = {
        match: match,
        friend: friend,
        enemy:enemy,
        age: age,
        sex: sex,
        orientation: orientation,
        single: single,
        location: location,
        thumbUrls: thumbUrls
      };

      var details = $('#profile_details dl');
      
      details.each(function(index, element){
       var $el = $(element);
        var value = $el.find('dd').text().trim();
        if (value !== '—') {
          var propName = $el.find('dt').text().toLowerCase().replace(' ', '_')
          
          if (propName === 'last_online') { value = $el.find('dd span').text(); }

          profile[propName] = value;
        }
      });

      cbk(profile);
    });
  },
  /*
    Callback is called every time a search gets results
  */
  locationIdFor: function(locationName, cbk){
    var url = util.format("http://www.okcupid.com/locquery?func=query&query=%s", encodeURIComponent(locationName));
    return request(url, function(err, resp, body){
      cbk(JSON.parse(body).results[0].locid);
    });
  },

  search: function(options, cbk){
    return new Search(options, cbk);
  }
};

module.exports = OKCupid;