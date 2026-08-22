const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const Event = require('../models/event.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const Registration = require('../models/registration.model')

// getEvents
const getEvents = asyncHandler(async (req, res) => {
    const {
        startDate,
        endDate,
        category,
        city,
        page: pageQ,
        limit: limitQ,
        sortBy,
        order,
        search,
    } = req.query;

    // Filteringg :D
    const filter = {};

    if (category) {
        filter.category = category;
    }

    if (city) {
        // made it case insensitive >->
        filter.city = { $regex: `^${city}$`, $options: "i" };
    }

    if (search) {
        filter.$or = [
            { title:       { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    if (startDate || endDate) {
        filter.date = {};

        // Added Validation
        if (startDate) {
            const start = new Date(startDate);

            if (isNaN(start.getTime())) {
                return res.status(400).json({ status: "error", message: "Invalid startDate" });
            }

            filter.date.$gte = start;
        }

        if (endDate) {
            const end = new Date(endDate);

            if (isNaN(end.getTime())) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid endDate",
                });
            }

            // Include the entire end date
            end.setHours(23, 59, 59, 999);

            filter.date.$lte = end;
        }
    }
    // Pagination
    const pageNum = parseInt(pageQ) || 1;
    const limitNum = parseInt(limitQ) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortDirection = order === 'desc' ? -1 : 1;

    const total = await Event.countDocuments(filter);

    let events;

    if (sortBy === 'registrations') {

        // Count registrations for each event
        events = await Event.aggregate([
            // 1. Apply your filters
            {
                $match: filter
            },

            // 2. Find registrations belonging to each event
            {
                $lookup: {
                    from: 'registrations',
                    localField: '_id',
                    foreignField: 'event',
                    as: 'registrations'
                }
            },

            // 3. Turn the registrations array into a number
            {
                $addFields: {
                    registrationCount: {
                        $size: '$registrations'
                    }
                }
            },

            // 4. Sort by that number
            {
                $sort: {
                    registrationCount: sortDirection
                }
            },

            // 5. Pagination
            {
                $skip: skip
            },
            {
                $limit: limitNum
            },

            // 6. Don't return the actual registrations array
            {
                $project: {
                    registrations: 0
                }
            }
        ]);

        // Populate category and organizer
        events = await Event.populate(events, [
            {
                path: 'category',
                select: 'name description -_id'
            },
            {
                path: 'organizer',
                select: 'name email -_id'
            }
        ]);

    } else {

        // Normal sorting, e.g. by date
        const sort = {
            date: sortDirection
        };

        events = await Event.find(filter)
            .populate({
                path: 'category',
                select: 'name description -_id'
            })
            .populate({
                path: 'organizer',
                select: 'name email -_id'
            })
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .lean();
    }

    res.json({
        status: 'success',
        data: events,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    });
});

// getEventById
const getEventById = asyncHandler(async (req, res) => {
    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new AppError('Invalid event ID.', 400);
    }

    const event = await Event.findById(req.params.id)
        .populate({
            path: 'category',
            select: 'name description -_id',
        })
        .populate({ path: "organizer", select: "name email -_id" })

    if (!event) {
        throw new AppError('Event not found.', 404);
    }

    res.json({
        status: 'success',
        data: event,
    });
});

// createEvent
const createEvent = asyncHandler(async (req, res) => {
    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        throw new AppError('Invalid category ID.', 400);
    }

    // Check that category exists
    const categoryExists = await Category.exists({
        _id: req.body.category,
    });

    if (!categoryExists) {
        throw new AppError('Category not found.', 404);
    }



    const event = await Event.create(req.body);

    // Populate category for consistent response
    await event.populate([
    {
        path: 'category',
        select: 'name description -_id',
    },
    {
        path: 'organizer',
        select: 'name email -_id',
    },
]);

    res.status(201).json({
        status: 'success',
        data: event,
    });
});

// updateEvent
const updateEvent = asyncHandler(async (req, res) => {
    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new AppError('Invalid event ID.', 400);
    }

    // If category is being updated, validate it
    if (req.body.category) {
        if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
            throw new AppError('Invalid category ID.', 400);
        }

        const categoryExists = await Category.exists({
            _id: req.body.category,
        });

        if (!categoryExists) {
            throw new AppError('Category not found.', 404);
        }
    }

    const event = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    ).populate({
        path: 'category',
        select: 'name description -_id',
    })
    .populate({ path: "organizer", select: "name email -_id" })

    if (!event) {
        throw new AppError('Event not found.', 404);
    }

    res.json({
        status: 'success',
        data: event,
    });
});

// deleteEvent
const deleteEvent = asyncHandler(async (req, res) => {
    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new AppError('Invalid event ID.', 400);
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
        throw new AppError('Event not found.', 404);
    }

    res.json({
        status: 'success',
        data: null,
    });
});

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}