const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const ctrl = require('../controllers/events.controller');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

// Literally so unnecessary
/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events until this date
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of events per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - registrations
 *         description: Sort events by registration count
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: asc
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search event title or description
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       400:
 *         description: Invalid date parameters
 */
router.get('/', ctrl.getEvents);

// --------------------------------------------------------------------------
/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Event not found
 */
router.get('/:id', ctrl.getEventById);

// --------------------------------------------------------------------------
/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - date
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tech Conference 2026
 *               category:
 *                 type: string
 *                 example: 64abc1234567890123456789
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-15T10:00:00Z
 *               capacity:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid event data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Category not found
 */
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

// --------------------------------------------------------------------------
/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     summary: Update an event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Conference
 *               category:
 *                 type: string
 *                 example: 64abc1234567890123456789
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-01T10:00:00Z
 *               capacity:
 *                 type: number
 *                 example: 150
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid event ID or event data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Event or category not found
 */
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

// --------------------------------------------------------------------------
/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Invalid event ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Event not found
 */
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteEvent);

module.exports = router;