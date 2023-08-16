const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topic.controller');
const { getApiDocumentation } = require('./controllers/api.controller');
const { getArticleById } = require('./controllers/article.controller');
app.use(express.json());


app.get('/api', getApiDocumentation);
app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticleById);

app.use((err, req, res, next) => {
	console.log('Error: ', err);

	if (err.message === 'Article not found') {
		res.status(404).send({ message: err.message });
	} else if (err.code === '22P02') {
		res.status(400).send({ message: 'Invalid article_id' });
	} else {
		res.status(500).send({ message: 'Internal Server Error' });
	}
})



module.exports = app;