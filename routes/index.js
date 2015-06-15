var express = require('express');
var router = express.Router();

var User = require('./db').User;


router.get('/', function(req, res) {
	if (req.signedCookies.name) {
		res.redirect('/user');
	} 
	else {
		res.render('index', {title: 'Вход'});
	}
});

router.post('/reg', function(req, res) {
	User.registration(req, res);
});

router.post('/enter', function(req, res) {
	User.enter(req, res);	
});

/*router.get('/rooms', function(req, res) {
	if (req.signedCookies.name) {
		res.render('rooms', {name: req.signedCookies.name});
	}
	else {
		res.redirect('/');
	}
})*/

router.post('/user', function(req, res) {
	res.render('userPage');
})

router.get('/user', function(req, res) {
	res.render('userPage');
})

module.exports = router;
