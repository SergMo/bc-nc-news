const { selectCommentsByArticleId } = require('../models/comment.model');
const { selectArticleById } = require('../models/article.model');


exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;

	Promise.all([
		selectArticleById(article_id),
		selectCommentsByArticleId(article_id)
	])

		.then(([article, comments]) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			if (err.message === 'Article not found') {
				res.status(404).send({ message: err.message });
			} else {
				next(err);
			}
		})
}