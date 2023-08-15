const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topic.controller');
const { getApiDocumentation } = require('./controllers/api.controller');
app.use(express.json());


app.get('/api', getApiDocumentation);
app.get('/api/topics', getAllTopics);






module.exports = app;