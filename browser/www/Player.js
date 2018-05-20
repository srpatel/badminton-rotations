var $Players = [];
var Player = function(n) {
  this.name = n;
  //this.singles = Math.round(Math.random() * 10);
  //this.doubles = Math.round(Math.random() * 10);
  this.singles = 0;
  this.doubles = 0;
  this.pseudo = -1;
  this.benched = true;
  for (var i in $Players) {
    var p = $Players[i];
    if (this.pseudo == -1 || p.gamesPlayed() < this.pseudo) {
      this.pseudo = p.gamesPlayed();
    }
  }
  if (this.pseudo == -1) {
    this.pseudo = 0;
  }
};
Player.prototype.gamesPlayed = function() {
  return this.singles + this.doubles + this.pseudo;
};

function getPlayers(n) {
  // Get n benched players, who've played the least.
  var benched = [];
  for (var i in $Players) {
    var p = $Players[i];
    if (p.benched) {
      benched.push( p );
    }
  }

  if (benched.length < n) {
    return false;
  } else {
    // Select n players -- who have:
    // 1) played the least!
    // 2) ties broken by 'played the least game mode'
    // 3) ties broken by random
    var sorted = _.sortBy(_.shuffle(benched)/*_.sortBy is stable*/, [
      function(o) { return o.gamesPlayed(); },
      function(o) { return n == 2 ? o.singles : o.doubles; }
    ]);
    var result = sorted.splice(0, n);
    return _.shuffle(result);
  }
};
function makePlayerFromJson(json) {
  var np = new Player(json.name);
  np.singles = json.singles;
  np.doubles = json.doubles;
  np.pseudo = json.pseudo;
  np.benched = true;
  return np;
}
