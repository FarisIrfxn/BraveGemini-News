const {
  listArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../models/articleModel');

function handleList(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = listArticles(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

function handleGet(req, res, next) {
  try {
    const article = getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
}

function handleCreate(req, res, next) {
  try {
    const created = createArticle(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Article with this URL already exists' });
    }
    next(err);
  }
}

function handleUpdate(req, res, next) {
  try {
    const updated = updateArticle(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

function handleDelete(req, res, next) {
  try {
    const ok = deleteArticle(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleList,
  handleGet,
  handleCreate,
  handleUpdate,
  handleDelete
};
