var Court = function(id) {
  this.id = id;
  this.players = [];
  this.startTime = 0;
  var self = this;
  this.element().click(function() {
    // if empty, generate singles or doubles
    if (self.players.length == 0) {
      // generate a game
      var p = getPlayers(4) || getPlayers(2);
      if (p) {
        self.startTime = new Date();
        var doubles = p.length == 4;
        for (var i in p) {
          self.players.push(p[i]);
          if (doubles) {
            p[i].doubles++;
          } else {
            p[i].singles++;
          }
          p[i].benched = false;
        }
        refreshPlayersList();
      } else {
        alert("Not enough players to start a game!");
        return;
      }
    } else {
      // bench players
      // if cycled very quickly, undo the assignment
      if (new Date().getTime() - self.startTime.getTime() < 10000) {
        // Less than a second, doesn't count!
        var doubles = self.players.length == 4;
        for (var i in self.players) {
          if (doubles) {
            self.players[i].doubles--;
          } else {
            self.players[i].singles--;
          }
        }
        alert('The game lasted less than 10 seconds, not counting as a game.');
      }
      for (var i in self.players) {
        self.players[i].benched = true;
      }
      refreshPlayersList();
      self.players = [];
    }
    self.redraw();
  });
};
Court.prototype.element = function() {
  return $('#' + this.id);
};
Court.prototype.setNameAt = function(i, n) {
  var q = this.element().find('.q' + i);
  q.html('');
  q.append($('<p>').text(n));
};
Court.prototype.redraw = function() {
  localStorage.setItem( 'courts', JSON.stringify(courts) );

  for (var i = 1; i <= 4; i++) this.setNameAt(i, '');

  if (this.players.length == 0) {
    // ...
  } else if (this.players.length == 2) {
    this.setNameAt(1, this.players[0].name);
    this.setNameAt(4, this.players[1].name);
  } else if (this.players.length == 4) {
    this.setNameAt(1, this.players[0].name);
    this.setNameAt(2, this.players[1].name);
    this.setNameAt(3, this.players[2].name);
    this.setNameAt(4, this.players[3].name);
  } else {
    alert( this.players.length + ' players found. 0, 2 or 4 expected.' );
    this.players = [];
    this.redraw();
  }
};
