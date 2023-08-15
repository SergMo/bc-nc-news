const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topic.controller');
const endpoints = require('./endpoints.json');

app.use(express.json());

app.get('/api', (req, res) => {
	res.json(endpoints);
});

app.get('/api/topics', getAllTopics);






module.exports = app;