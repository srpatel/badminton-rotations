var Court = function(id) {
  this.id = id;
  this.players = [];
  this.startTime = 0;
  var self = this;
  var generate = function () {
	if (self.players.length == 0) {
	  // generate
	  var desiredNumPlayers = 0;
	  if ($(this).hasClass('h1')) {
		desiredNumPlayers = 4;
	  } else {
	    desiredNumPlayers = 2;
	  }
	  console.log(desiredNumPlayers);
	  var p = getPlayers(desiredNumPlayers);
      if (p) {
        self.generateWithPlayers(p);
      } else {
        alert("Not enough players to start a game!");
        return;
      }
	}
	self.redraw();
  };
  var empty = function () {
	if (self.players.length != 0) {
	  // empty
	  // bench players
	  // if cycled very quickly, undo the assignment
      if (new Date().getTime() - self.startTime.getTime() < 60000) {
        // Less than a second, doesn't count!
        var doubles = self.players.length == 4;
        for (var i in self.players) {
          self.players[i].previousType = self.players[i].oldPreviousType;
          if (doubles) {
            self.players[i].doubles--;
            var other;
            if (i <= 1) {
              other = 1 - i;
            } else {
              other = 5 - i;
            }
            self.players[i].decNumPlayedDoublesWith(self.players[other].name);
          } else {
            self.players[i].singles--;
            self.players[i].decNumPlayedSinglesAgainst(self.players[1 - i].name);
          }
        }
        alert('The game lasted less than 60 seconds; not counting as a game.');
      }
      for (var i in self.players) {
        self.players[i].benched = true;
      }
      refreshPlayersList();
      self.players = [];
	}
	self.redraw();
  };
  this.element().find('.h').click(generate);
  this.element().find('.q').click(empty);
  this.redraw();
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
  this.element().find('.h').toggle(this.players.length == 0);
  this.element().find('.q').toggle(this.players.length != 0);
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
Court.prototype.generateWithPlayers = function(p) {
  this.startTime = new Date();
  var doubles = p.length == 4;
  if (doubles) {
    // There are 3 combinations. Find the best...
    var option1 = p[0].numPlayedDoublesWith(p[1]) + p[2].numPlayedDoublesWith(p[3]);
    var option2 = p[0].numPlayedDoublesWith(p[2]) + p[1].numPlayedDoublesWith(p[3]);
    var option3 = p[0].numPlayedDoublesWith(p[3]) + p[1].numPlayedDoublesWith(p[2]);
    // Which is smallest?
    if (option1 <= option2 && option1 <= option3) {
      // This is the default setup
    } else if (option2 <= option1 && option2 <= option3) {
      // 0 with 2 and 1 with 3
      // SWAP 1 and 2
      var temp = p[1];
      p[1] = p[2];
      p[2] = temp;
    } else if (option3 <= option1 && option3 <= option2) {
      // 0 with 3 and 1 with 2
      // SWAP 1 and 3
      var temp = p[1];
      p[1] = p[3];
      p[3] = temp;
    }
  }
  for (var i in p) {
    this.players.push(p[i]);
    p[i].oldPreviousType = p[i].previousType;
    if (doubles) {
      p[i].previousType = "doubles";
      p[i].doubles++;
      if (i <= 1) {
        var other = 1 - i;
        p[i].incNumPlayedDoublesWith(p[other].name);
      } else {
        var other = 5 - i;
        p[i].incNumPlayedDoublesWith(p[other].name);
      }
    } else {
      p[i].previousType = "singles";
      p[i].singles++;
      var other = 1 - i;
      p[i].incNumPlayedSinglesAgainst(p[other].name);
    }
    p[i].benched = false;
  }
  refreshPlayersList();
  this.redraw();
};
