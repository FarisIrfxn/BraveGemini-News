const express = require('express');
const Joi = require('joi');
const {
  handleList,
  handleGet,
  handleCreate,
  handleUpdate,
  handleDelete
} = require('../controllers/articleController');

const router = express.Router();

const articleSchema = Joi.object({
  title: Joi.string().min(3).required(),
  url: Joi.string().uri().required(),
  summary: Joi.string().allow('', null),
  highlights: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().allow('', null),
  publishedAt: Joi.string().isoDate().allow(null)
});

router.get('/', handleList);
router.get('/:id', handleGet);

router.post('/', (req, res, next) => {
  try {
    const { error, value } = articleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    handleCreate(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const { error, value } = articleSchema.fork(
      ['title', 'url'],
      (schema) => schema.optional()
    ).validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    req.body = value;
    handleUpdate(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', handleDelete);

module.exports = router;
