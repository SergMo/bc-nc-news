const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topic.controller');
const { getApiDocumentation } = require('./controllers/api.controller');
const { getArticleById } = require('./controllers/article.controller');
app.use(express.json());


app.get('/api', getApiDocumentation);
app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticleById);


module.exports = app;