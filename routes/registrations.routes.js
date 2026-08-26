const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const ctrl = require('../controllers/registrations.controller');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post(
  '/',
  requireAuth,
  [
    body('event')
      .isMongoId()
      .withMessage('eventId must be a valid MongoId'),
  ],
  validate,
  ctrl.registerForEvent
);
router.get('/my', requireAuth, ctrl.getMyRegistrations);
router.delete('/:id', requireAuth, ctrl.cancelRegistration);

module.exports = router;