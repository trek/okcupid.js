function combineAgeOptions(options){
  var minAge = options.minAge,
      maxAge = options.maxAge;

  delete options.minAge;
  delete options.maxAge;

  options.age = [minAge, maxAge];
}

function buildUrl(filters, params, timekey){
  var magicParamsNotTrulyUnderstood = util.format("timekey=%s&custom_search=0", timekey);
  var pattern = "/match?#{filters_as_query}&#{parameters_as_query}&#{magic_params_not_truly_understood}";
}

var extend = require('lodash').extend;
var filters = {
  age: function(ages){
    return ages.join(',');
  }
};

module.exports = function(options, cbk){
  if (!options.gentation) { throw('gentation is a required option'); }

  combineAgeOptions(options);

  this.options  = extend(options, this.defaults);

  this.cbk = cbk;

  // filters appear in the query string as filterN=code,value
  // e.g. filter4=11,75
  this.filters = [];
  
  for(var key in this.options) {
    this.filters.push( filters[key](this.options[key]) );
  }
  // parameters appear in the query string as named query parameters
  // e.g. loc_id=1234567
  this.parameters = [];

  // OKC needs an initial time key of 1 to represent "waaaay in the past"
  // futures searches will use the OKC server value returned from the first
  // results set.

  this.next();
}

Search.prototype = {
  timekey: 1,

  defaults: {
    pagination: {
      page: 1,
      perPage: => 10
    },
    minAge: 18,
    maxAge: 99,
    orderBy: 'Match %',
    lastLogin: 'last month',
    location: 'Near me',
    radius: 25,
    requirePhoto: true,
    relationshipStatus: 'single'
  },
  next: function(){
    // the first results request has to receive a full HTML page.
    // subseqent calls can make json requests
    // page = @browser.get(url)
    
    // # Stores the OKCupid server timestamp. Without this, pagination returns
    // # inconsistent results.
    // @timekey = page.search('script')[0].text.match(/CurrentGMT = new Date\(([\d]+)\*[\d]+\)/).captures[0]
    
    // # OKCupid may return previously found profiles if there aren't enough
    // # to fill a query or pagination, so we stop that with a set.
    // @results = Set.new
    // @results += page.search('.match_row').collect do |node|
    //   OKCupid::Profile.from_search_result(node)
    // end
          
    // @results
  }
};
