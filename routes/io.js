var express = require('express');

var User = require('./db').User;

var player1 = false;
var player2 = false;
var started = false;
var turn = 1;
var last_turn = new Object();
last_turn.x = 0;
last_turn.y = 0;

var field = new Array(10);
for (var i = 0; i < 10; ++i) {
	field[i] = new Array(10);
	for (var j = 0; j < 10; ++j) {
		field[i][j] = 0;
	}
}

var big_field = new Array(4);
for (var i = 0; i < 4; ++i) {
	big_field[i] = new Array(4);
	for (var j = 0; j < 4; ++j) {
		big_field[i][j] = 0;
	}
}

function check(x, y) {
	if (field[x][y] != 0) {
		return 0;
	}
	if (last_turn.x == 0 && last_turn.y == 0) {
		console.log('from 0 0');
		return 1;
	}
	var row = (last_turn.x - 1) % 3 + 1;
	var column = (last_turn.y - 1) % 3 + 1;
	if ((row - 1) * 3 < x  && x <= row * 3 && (column - 1) * 3 < y && y <= column * 3) {
		console.log('from ' + last_turn.x + ' ' + last_turn.y);
		return 1;
	}
	else {
		return 0;
	}
}

function local_win(x, y) {
	var row = Math.floor((x - 1) / 3) + 1;
	var column = Math.floor((y - 1) / 3) + 1;
	var i = (row - 1) * 3;
	var j = (column - 1) * 3;
	console.log('checked local win');
	console.log(i, j);
	if (field[i + 1][j + 1] == turn && field[i + 2][j + 1] == turn && field[i + 3][j + 1] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (field[i + 1][j + 2] == turn && field[i + 2][j + 2] == turn && field[i + 3][j + 2] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (field[i + 1][j + 3] == turn && field[i + 2][j + 3] == turn && field[i + 3][j + 3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (field[i + 1][j + 1] == turn && field[i + 1][j + 2] == turn && field[i + 1][j + 3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (field[i + 2][j + 1] == turn && field[i + 2][j + 2] == turn && field[i + 2][j + 3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (field[i + 3][j + 1] == turn && field[i + 3][j + 2] == turn && field[i + 3][j + 3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (field[i + 1][j + 1] == turn && field[i + 2][j + 2] == turn && field[i + 3][j + 3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (field[i + 3][j + 1] == turn && field[i + 2][j + 2] == turn && field[i + 1][j + 3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	return false;
}

function win(row, column) {
	var i = row - 1;
	var j = column - 1;
	if (big_field[1][1] == turn && big_field[2][1] == turn && big_field[3][1] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (big_field[1][2] == turn && big_field[2][2] == turn && big_field[3][2] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (big_field[1][3] == turn && big_field[2][3] == turn && big_field[3][3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (big_field[1][1] == turn && big_field[1][2] == turn && big_field[1][3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (big_field[2][1] == turn && big_field[2][2] == turn && big_field[2][3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (big_field[3][1] == turn && big_field[3][2] == turn && big_field[3][3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (big_field[1][1] == turn && big_field[2][2] == turn && big_field[3][3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	else if (big_field[3][1] == turn && big_field[2][2] == turn && big_field[1][3] == turn) {
		console.log('local win ' + turn);
		return true;
	}
	return false;	
}

function possible_next_turn(x, y) {
	var row = (x - 1) % 3 + 1;
	var column = (y - 1) % 3 + 1;
	for (var i = (row - 1) * 3 + 1; i <= row * 3; ++i) {
		for (var j = (column - 1) * 3 + 1; j <= column * 3; ++j) {
			if (field[i][j] == 0) {
				return true;
			}
		}
	}
	return false;
}

function initSocket(server) {
	var io = require('socket.io')(server);

	io.on('connection', function(socket) {

		socket.on('new user', function(name) {

			console.log('new user online: ' + name);
			console.log(socket.id);

			if (player1 != false && player2 == false) {
				player2 = socket.id;
				started = true;
				console.log('2pl');
				console.log('start');
				socket.emit('second player');
			}

			if (player1 == false) {
				player1 = socket.id;
				console.log('1pl');
				socket.emit('first player');
			}
		});

		socket.on('turn', function(data) {
			if (started != true) {
				console.log('qwerty');
				return;
			}
			if (turn == 1 && socket.id == player1) {
				var x = data[0];
				var y = data[1];
				console.log(x, y);
				if (check(x, y) == 1) {
					field[x][y] = 1;
					if (local_win(x, y) == true) {
						var row = Math.floor((x - 1) / 3) + 1;
						var column = Math.floor((y - 1) / 3) + 1;
						big_field[row][column] = turn;
						for (var i = (row - 1) * 3 + 1; i <= row * 3; ++i) {
							for (var j = (column - 1) * 3 + 1; j <= column * 3; ++j) {
								console.log(i, j);
								field[i][j] = 1;
							}
						}
						if (win(row, column) == true) {
							io.emit('end game', turn);
						}
					}
					if (possible_next_turn(x, y) == true) {
						last_turn.x = x;
						last_turn.y = y;
					}
					else {
						last_turn.x = 0;
						last_turn.y = 0;
					}
					turn = 2;
					io.emit('turn', field);
				}
			}
			if (turn == 2 && socket.id == player2) {
				var x = data[0];
				var y = data[1];
				console.log(x, y);
				if (check(x, y) == 1) {
					field[x][y] = 2;
					if (local_win(x, y) == true) {
						var row = Math.floor((x - 1) / 3) + 1;
						var column = Math.floor((y - 1) / 3) + 1;
						big_field[row][column] = 2;
						for (var i = (row - 1) * 3 + 1; i <= row * 3; ++i) {
							for (var j = (column - 1) * 3 + 1; j <= column * 3; ++j) {
								console.log(i, j);
								field[i][j] = 2;
							}
						}
						if (win(row, column) == true) {
							io.emit('end game', turn);
						}
					}
					if (possible_next_turn(x, y)) {
						last_turn.x = x;
						last_turn.y = y;
					}
					else {
						last_turn.x = 0;
						last_turn.y = 0;
					}
					turn = 1;
					io.emit('turn', field);
				}
			}

		});
	});
}



module.exports = initSocket;