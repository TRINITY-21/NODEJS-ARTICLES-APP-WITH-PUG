const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const session = require('express-session')

let Article = require('./Models/Articles')

mongoose.connect('mongodb://localhost/Articles')
let db = mongoose.connection

db.once('open', function(){
	console.log('Connected to Database')
})

db.on('error', function(err) {
	console.log(err)
})

const app = express()
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({extended:false}))

app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'pug')

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Routes

app.get('/', (req,res)=> {
	Article.find({},function(err, articles){
		if(err){
			console.log(err)
		}else{
				res.render('index', {
			title:'Articles',
			articles: articles
	})
		}

	})
})
	


app.get('/articles/add', (req,res)=> {
	res.render('add_article', {
		title:'Add Articles'
	})
})


app.post('/articles/add', (req,res)=>{
	let article = new Article()
	article.title = req.body.title,
	article.author = req.body.author,
	article.body = req.body.body

	article.save(function(err){
		if(err){
			console.log(err)
		}else{
			req.flash('success', 'Article Added')
			res.redirect('/')
		}
	})
})


app.get('/article/:id', (req,res)=>{
	Article.findById(req.params.id,(err,article)=>{
		res.render('article', {
		article:article
	})
})

})

//Edit
app.get('/article/edit/:id', (req,res)=>{
	Article.findById(req.params.id,(err,article)=>{
		res.render('edit_article', {
			title:'Edit',
		article:article
	})
})

})


app.post('/article/edit/:id', (req,res)=>{
	let article = {}
	article.title = req.body.title,
	article.author = req.body.author,
	article.body = req.body.body

	let query = {_id:req.params.id}

	Article.update(query, article,function(err){
		if(err){
			console.log(err)
		}else{
			res.redirect('/')
		}
	})
})

app.delete('/article/:id', (req,res)=>{
	let query = {_id:req.params.id}

	Article.remove(query, function(err){
		if(err){
		console.log(err)
	}
	res.send('Success')
	})
})






const PORT = process.env.PORT || 9000

app.listen(PORT, console.log(`Server running on port ${PORT}`))