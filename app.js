const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topic.controller');
app.use(express.json());

app.get('/api/topics', getAllTopics);


module.exports = app;