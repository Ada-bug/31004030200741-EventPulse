const AppError = require('../utils/AppError');

const requireRole = (role) => {
    return (req, res, next) => {
        if(!req.user || req.user.role != role){
        return next(new AppError('Access denied', 403));
        }
    next()
    }
}

module.exports = requireRole;