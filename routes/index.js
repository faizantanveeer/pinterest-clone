var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const upload = require('./multer');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(userModel.authenticate()));

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/login', function (req, res) {
	res.render('login', { error: req.flash('error') });
});

router.get('/feed', isLoggedIn, function (req, res) {
	res.render('feed');
});

router.post('/upload',isLoggedIn, upload.single('file'), async function (req, res, next) {
	if (!req.file) {
		return res.status(400).send('No files were Uploaded.');
	}
	const user = await userModel.findOne({
		username: req.session.passport.user,
	});

	const post = await postModel.create({
		postText: req.body.postCaption,
		users: user._id,
		image: req.file.filename
	})

	user.posts.push(post._id);
	await user.save();
	res.redirect('/profile')
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
	const userdata = await userModel.findOne({
		username: req.session.passport.user,
	})
	.populate("posts");
	console.log(userdata);
	res.render('profile', { user: userdata });
});

router.post('/register', async function (req, res) {
	const { username, email, fullname } = req.body;
	const newUser = new userModel({ username, email, fullname });

	userModel.register(newUser, req.body.password).then(function () {
		passport.authenticate('local')(req, res, function () {
			res.redirect('/feed');
		});
	});
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true,
	}),
	function (req, res) {}
);

router.get('/logout', function (req, res) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/login');
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
