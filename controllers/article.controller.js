const { selectArticleById } = require('../models/article.model');


exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	if (!Number(article_id)) {
		return res.status(400).json({ message: 'Invalid article_id' });
	}

	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			res.status(404).json({ message: err.message });
		});
};