const { selectCommentsByArticleId, insertComment } = require('../models/comment.model');
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
		.catch(next)
}
exports.postCommentByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;

	if (!username || !body) {
		return res.status(400).send({ message: 'Bad Request' })
	}

	selectArticleById(article_id)
		.then((article) => {
			if (!article) {
				req.status(404).send({ message: err.message });
			} else {
				insertComment(article_id, username, body)
					.then((comment) => {
						res.status(201).send({ comment })
					})
					.catch(next);
			}
		})
		.catch(next)

}
