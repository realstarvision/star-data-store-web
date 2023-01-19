import request from '@/utils/request'

const api = {
  parseGeoJson: '/star-store/satellite/analysisZIPtoGeoJSON',
}

// 解析ZIP接口
export function parseGeoJson(data) {
  return request({
    url: api.parseGeoJson,
    method: 'post',
    data,
  })
}
