const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pinterstclone');

const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
	],
	dp: {
		type: String, // Assuming that the display picture is stored as a URL or file path
	},
	fullname: {
		type: String,
		required: true,
	},
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
