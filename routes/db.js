var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/users')
//mongoose.connect('mongodb://voropavlik:voropavlik@ds043348.mongolab.com:43348/mydb');

var userSchema = mongoose.Schema({
	login: String,
	password: String
})

var User = mongoose.model('User', userSchema);


User.registration = function(req, res) {
	var new_user = new User;
	new_user.login = req.body.regLogin;
	new_user.password = req.body.regPassword;

	console.log(new_user);

	User.find({login: new_user.login}, function(err, user) {
		if (user.length > 0) {
			res.render('regError');
		}
		else {
			new_user.save(function(err, new_user) {
				if (err) return console.error(err);
				console.log('saved ' + new_user.login);
			});

			res.render('index');
		}
	});
}

User.enter = function(req, res) {
	var login = req.body.enterLogin;
	var password = req.body.enterPassword;
	console.log(login);
	console.log(password);
	mongoose.model('User').find({login: login, password: password}, function(err, user) {
		if (err) return console.error(err);
		if (user.length == 0) {
			res.render('enterError');
		}
		else {
			res.cookie('name', req.body.enterLogin, { signed: true });
			res.redirect('/user');
		}
	});
}

module.exports.User = User; 
