const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const ctrl = require('../controllers/registrations.controller');

router.post('/', requireAuth, ctrl.registerForEvent);
router.get('/my', requireAuth, ctrl.getMyRegistrations);
router.delete('/:id', requireAuth, ctrl.cancelRegistration);

module.exports = router;