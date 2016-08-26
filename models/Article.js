var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
		dropDups: true
	},

	link: {
		type: String,
		required: true,
		unique: true,
		dropDups: true
	},

	note: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;