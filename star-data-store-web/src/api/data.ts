import request from '@/utils/request'
import axios from 'axios'


// 请求中断
let CancelToken = axios.CancelToken
  ; (window as any).cancelRequest = null

// api
const api = {
  getFileList: '/star-store/satellite/findListByPage'
}


/**
 *  查询ES卫星数据
*/
export function getESList(data: any) {
  return request({
    // baseURL: '/geo',
    url: api.getFileList,
    method: 'post',
    data,
    cancelToken: new CancelToken(function executor(c) {
      ; (window as any).cancelRequest = c
    })
  })
}



