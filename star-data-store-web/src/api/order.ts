
import request from '@/utils/request'

const api = {
  saveOrder: '/star-store/order/save',
  getOrderListByUserId: '/star-store/order/findListByPage',
  findDelivery: '/star-store/order/findDelivery',
  updateOrderByOrderId: '/star-store/order/update'
}


/**
 *  分页获取日志列表
*/
export function saveOrder(data) {
  return request({
    url: api.saveOrder,
    method: 'POST',
    data
  })
}



/**
 *  根据客户id查询订单接口
*/
export function getOrderListByUserId(data) {
  return request({
    url: api.getOrderListByUserId,
    method: 'POST',
    data
  })
}

/**
 *  根据订单ID 获取交付物链接
*/
export function findDelivery(data) {
  return request({
    url: api.findDelivery,
    method: 'POST',
    data
  })
}

/**
 *  更新订单
*/
export function updateOrderByOrderId(data) {
  return request({
    url: api.updateOrderByOrderId,
    method: 'POST',
    data
  })
}


