const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取token
      token = req.headers.authorization.split(' ')[1];

      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Token验证失败:', error);
      res.status(401).json({ message: '未授权，token无效' });
    }
  }

  if (!token) {
    res.status(401).json({ message: '未授权，没有token' });
  }
};

module.exports = { protect }; 