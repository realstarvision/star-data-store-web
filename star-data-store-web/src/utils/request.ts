import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { getToken, removeToken, removeUserInfo } from './auth'
import Message from '@/components/Message'
import i18n from 'i18next'


const instance = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    starToken: ''
  }
});


// request拦截器
instance.interceptors.request.use(
  (config: any) => {
    // 是否需要设置 token
    if (getToken()) {
      config.headers['starToken'] = getToken()  // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // const { t } = useTranslation()
    // 未设置状态码则默认成功状态
    const status = res.data.code || 200
    if (status === 401 || status === 10001) {
      Message({ content: i18n.t('Drawer.message.staleDated') })
      setTimeout(() => {
        location.href = "/login"
        removeToken()
        removeUserInfo()
      }, 3000)
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (status === 500) {
      // Message.error('服务器错误')
      // Message({
      //   content: '服务器错误', style: {
      //     marginTop: '120px'
      //   }
      // })
      return Promise.reject(new Error('服务器错误'))
    }
    else if (status === 502) {
      // Message({ content: i18n.t('Drawer.message.timeOut') })
      return Promise.reject(new Error('请求超时'))
    }
    else if (status === 20001) {
      Message({ content: i18n.t('login.prompt.lock') })
      // return Promise.reject(res.data)
      return res.data
    } else if (status !== 200 && status !== 10002 && status !== 10004) {
      // return Promise.reject(res.data)
      return res.data
    } else {
      return res.data
    }
  },
  (error) => {
    let { message } = error
    if (message.indexOf('502') !== -1) {
      // Message({
      //   content: i18n.t('Drawer.message.timeOut'), style: {
      //     marginTop: '120px',
      //     marginLeft: '100px'
      //   }
      // })
      return Promise.reject(new Error('请求超时'))
    }
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status status')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    return Promise.reject(error)
  }
)


export default instance