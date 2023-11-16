const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const bcrypt = require('bcryptjs');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const userCache = new NodeCache();

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
async function correctPassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.name);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Remove password from output
  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  // 1) Check if email and password exist
  if (!userName || !password) {
    return next(new AppError('Please provide userName and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = userCache.get(userName);

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError('Incorrect userName or password', 401));
  }
  user.password = undefined;

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});
exports.verify = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403);
    }
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: user.id
      }
    });
  });

  // GRANT ACCESS TO PROTECTED ROUTE
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = userCache.get(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.createUser = async (userName, password) => {
  password = await bcrypt.hash(password, 12);
  const user = {
    name: userName,
    password
  };
  userCache.set(userName, user);
};
