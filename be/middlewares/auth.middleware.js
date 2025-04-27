// Middleware để kiểm tra nếu người dùng đã đăng nhập
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();  // Nếu người dùng đã đăng nhập, tiếp tục xử lý yêu cầu
    } else {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });  // Trả về lỗi nếu chưa đăng nhập
    }
  }
  
  // Middleware kiểm tra quyền (role) của người dùng
  function hasRole(role) {
    return (req, res, next) => {
      if (req.session.user && req.session.user.role === role) {
        return next();  // Nếu người dùng có quyền truy cập (ví dụ: role là 'Admin')
      } else {
        return res.status(403).json({ message: 'Forbidden. You do not have the required permissions.' });  // Trả về lỗi nếu không có quyền
      }
    };
  }
  
  module.exports = { isAuthenticated, hasRole };
  