const mongoose = require('mongoose')

let ArticleSchema = mongoose.Schema({
	title:{
		type:String,
		required:true
	},

	author:{
		type:String,
		required:true
	},

	body:{
		type:String,
		required:true
	},
})

let Article = mongoose.model('Article', ArticleSchema)

module.exports = Article