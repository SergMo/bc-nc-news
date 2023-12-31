const express = require('express');
const cors = require('cors');

const { getAllTopics } = require('./controllers/topic.controller');
const { getApiDocumentation } = require('./controllers/api.controller');
const { getArticleById, getAllArticles, updateArticleById } = require('./controllers/article.controller');
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require('./controllers/comment.controller');

const {
	pathError,
	generalErrors,
	Error400,
	Error404,
	Error500
} = require('./errors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', getApiDocumentation);
app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);
app.patch('/api/articles/:article_id', updateArticleById);
app.delete('/api/comments/:comment_id', deleteCommentById);

app.use((err, req, res, next) => {
	if (err.message === 'Article not found') {
		res.status(404).send({ message: err.message });
	} else if (err.code === '22P02') {
		res.status(400).send({ message: 'Invalid id' });
	} else {
		res.status(500).send({ message: 'Internal Server Error' });
	}
})



module.exports = app;