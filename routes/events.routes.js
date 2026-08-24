const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const ctrl = require('../controllers/events.controller');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getEvents);

router.get('/:id', ctrl.getEventById);

router.post(
  '/',
  requireAuth,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required'),

    body('category')
      .isMongoId()
      .withMessage('Category must be a valid MongoId'),

    body('date')
      .isISO8601()
      .withMessage('Date must be valid'),

    body('capacity')
      .isFloat({ gt: 0 })
      .withMessage('Capacity must be a positive number'),
  ],
  validate,
  ctrl.createEvent
);

router.patch(
  '/:id',
  requireAuth,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid event ID'),

    body('title').optional().notEmpty(),
    body('category').optional().isMongoId(),
    body('date').optional().isISO8601(),
    body('capacity').optional().isFloat({ gt: 0 }),
  ],
  validate,
  ctrl.updateEvent
);

router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteEvent);

module.exports = router;