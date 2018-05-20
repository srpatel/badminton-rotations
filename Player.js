var $Players = [];
var Player = function(n) {
  this.name = n;
  this.arrivedAt = new Date().getTime();
  this.singles = 0;
  this.doubles = 0;
  this.pseudoSingles = -1;
  this.pseudoDoubles = -1;
  this.benched = true;
  this.paused = false;
  this.singlesAgainst = {};
  this.doublesWith = {};
  for (var i in $Players) {
    var p = $Players[i];
    if (this.pseudoSingles == -1 || p.singlesGamesPlayed() < this.pseudoSingles) {
      this.pseudoSingles = p.singlesGamesPlayed();
    }
	if (this.pseudoDoubles == -1 || p.doublesGamesPlayed() < this.pseudoDoubles) {
      this.pseudoDoubles = p.doublesGamesPlayed();
    }
  }
  if (this.pseudoSingles == -1) {
    this.pseudoSingles = 0;
  }
  if (this.pseudoDoubles == -1) {
    this.pseudoDoubles = 0;
  }
};
Player.prototype.getArrivalTime = function() {
  var d = new Date(this.arrivedAt);
  var hours = d.getHours();
  if (hours <= 9) hours = "0" + hours;
  var minutes = d.getMinutes();
  if (minutes <= 9) minutes = "0" + minutes;
  var seconds = d.getSeconds();
  if (seconds <= 9) seconds = "0" + seconds;
  return hours + ":" + minutes + ":" + seconds;
};
Player.prototype.gamesPlayed = function() {
  return this.singlesGamesPlayed() + this.doublesGamesPlayed();
};
Player.prototype.singlesGamesPlayed = function() {
  return this.singles + this.pseudoSingles;
};
Player.prototype.doublesGamesPlayed = function() {
  return this.doubles + this.pseudoDoubles;
};
Player.prototype.numPlayedSinglesAgainst = function(name) {
  if (this.singlesAgainst[name]) {
    return this.singlesAgainst[name];
  } else {
    return 0;
  }
};
Player.prototype.numPlayedDoublesWith = function(name) {
  if (this.doublesWith[name]) {
    return this.doublesWith[name];
  } else {
    return 0;
  }
};
Player.prototype.incNumPlayedSinglesAgainst = function(name) {
  if (this.singlesAgainst[name]) {
    this.singlesAgainst[name]++;
  } else {
    this.singlesAgainst[name] = 1;
  }
};
Player.prototype.incNumPlayedDoublesWith = function(name) {
  if (this.doublesWith[name]) {
    this.doublesWith[name]++;
  } else {
    this.doublesWith[name] = 1;
  }
};
Player.prototype.decNumPlayedSinglesAgainst = function(name) {
  this.singlesAgainst[name]--;
};
Player.prototype.decNumPlayedDoublesWith = function(name) {
  this.doublesWith[name]--;
};

function getAvailablePlayers() {
  var benched = [];
  for (var i in $Players) {
    var p = $Players[i];
    if (p.benched && !p.paused) {
      benched.push( p );
    }
  }
  return benched;
}

function getPlayers(n, benched) {
  // Get n benched players, who've played the least.
  // We don't care about finding who's played the least
  // if we've been given a pool of players.
  var careAboutNum = false;
  if (! benched) {
    careAboutNum = true;
    benched = getAvailablePlayers();
  }
  if (benched.length < n) {
    return false;
  } else {
    // Select n players -- who have:
    // 0) not played singles previously, if this is for singles
    // 1) played the least!
    // 2) ties broken by 'played the least game mode'
    // 3) ties broken by random
    var sortFuncs = [];
    if (careAboutNum) {
      sortFuncs.push( function(o) { return o.gamesPlayed(); } );
    }
    if (n == 2) {
      sortFuncs.push( function(o) { return o.singlesGamesPlayed(); } );
    }
    if (n == 4) {
      sortFuncs.push( function(o) { return o.doublesGamesPlayed(); } );
    }
    if (n == 2) {
      sortFuncs.push( function(o) { return o.previousType == "singles" ? 0 : 1; } );
    }
    var sorted = _.sortBy(_.shuffle(benched)/*_.sortBy is stable*/, sortFuncs);
    // TODO : Try to get matches which have not happened before
    var result = sorted.splice(0, n);
    return _.shuffle(result);
  }
};
function makePlayerFromJson(json) {
  var np = new Player(json.name);
  np.singles = json.singles;
  np.doubles = json.doubles;
  np.pseudoSingles = json.pseudoSingles;
  np.pseudoDoubles = json.pseudoDoubles;
  np.arrivedAt = json.arrivedAt;
  np.benched = true;
  np.paused = false;
  return np;
}
