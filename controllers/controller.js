var express = require('express');
var router = express.Router();
var request = require('request');

var Article = require('../models/Article');
var Note = require('../models/Note');
var mongoose = require('mongoose');
var cheerio = require('cheerio');

mongoose.connect('mongodb://heroku_68jzq3rz:h7j1tjn33kvbt4k1mbiot4c75l@ds013926.mlab.com:13926/heroku_68jzq3rz');

var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Mongoose Error: ', err);
});

db.once('open', function() {
	console.log("Mongoose connection successful");
});

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/scrape', function(req, res) {
	request('https://news.ycombinator.com/', function(error, response, html) {
		var $ = cheerio.load(html);

		$('.title').each(function(i, element) {
			var result = {};

			result.title = $(this).children('a').text();
			result.link = $(this).children('a').attr('href');

			var entry = new Article(result);

			entry.save(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		});
		res.send("Scrape Complete");
	});
});

router.get('/articles', function(req, res) {
	Article.find({}, function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

router.get('/articles/:id', function(req, res) {
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

router.post('/articles/:id', function(req, res) {
	var newNote = new Note(req.body);

	newNote.save(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note': doc._id})
			.exec(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});

router.delete('/notes/:articleId', function(req, res) {
	var articleId = req.params.articleId;
	console.log(1, articleId);
	Article.findOneAndUpdate({"_id": mongoose.Types.ObjectId(articleId)}, {$set: {'note': undefined}}, function(err, result) {
		if (err) {
			throw err;
		} else {
			console.log(2, result);
			Note.remove({_id: result.note}).exec(function(err, result){
				if (err) {
					throw err;
				} else {
					console.log(3, result)
					res.send(200);
				}
			})
		}
	});
});

module.exports = router;