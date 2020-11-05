const path = '/mock';
const base = require('./apis/base'); // 基础的接口

module.exports = {
  [`${path}/usercenter/login`]: base.login, // 登录
  [`${path}/usercenter/user/userMenu`]: base.menu, // 菜单
  [`${path}/usercenter/user/userInfo`]: base.staff, // 用户信息
  [`${path}/usercenter/logout`]: base.logout, // 退出
};
