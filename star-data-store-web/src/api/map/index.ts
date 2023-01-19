import request from '@/utils/request'

const api = {
  getSkyMapList: '/star-store/satellite/getStoreMapList',
}

/**
 *  获取地图列表
 */
export function getMapList() {
  return request({
    url: api.getSkyMapList,
    method: 'get',
  })
}
