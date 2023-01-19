import request from '@/utils/request'

const api = {

  isEmail: '/star-store/user/verify',
  register: '/star-store/user/register',
  Login: '/star-store/user/login',
}



/* 验证邮箱是否存在 */
export function isEmail(data) {
  return request({
    url: api.isEmail,
    method: 'post',
    data
  })
}


/* 用户注册 */
export function register(data) {
  return request({
    url: api.register,
    method: 'post',
    data
  })
}

/* 用户登录 */
export function Login(data) {
  return request({
    url: api.Login,
    method: 'post',
    data
  })
}