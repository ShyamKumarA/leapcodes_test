const User = require("../db/models/user");
const catchAsync = require("../middleware/catchAsync");

;

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows: users } = await User.findAndCountAll({
    offset,
    limit,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });

  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      totalUsers: count,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  });
});
