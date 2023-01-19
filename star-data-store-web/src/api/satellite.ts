import request from '@/utils/request'

const api = {
  getSatelliteList: '/star-store/satellite/satelliteList',
}


/**
 *  获取卫星基本信息列表
*/
export function getSatelliteList() {
  return request({
    url: api.getSatelliteList,
    method: 'get',
  })
}
