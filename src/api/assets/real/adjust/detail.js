import request from '@/utils/request'

// 用单据编码查询明细数量
export function checkDetail(invoiceNumber) {
  return request({
    url: '/assets/real/add/detail/select/' + invoiceNumber,
    method: 'get'
  })
}
// 查询资产明细列表
export function listDetail(query) {
  return request({
    url: '/assets/real/adjust/detail/list',
    method: 'get',
    params: query
  })
}
// 新增资产明细
export function addDetail(data) {
  return request({
    url: '/assets/real/adjust/detail/add',
    method: 'post',
    data: data
  })
}
// 查询资产明细详细
export function getDetail(id) {
  return request({
    url: '/assets/real/adjust/detail/' + id,
    method: 'get'
  })
}

// 修改资产明细
export function updateDetail(data) {
  return request({
    url: '/assets/real/adjust/detail/update',
    method: 'put',
    data: data
  })
}

// 删除资产明细
export function delDetail(id) {
  return request({
    url: '/assets/real/adjust/detail/remove/' + id,
    method: 'delete'
  })
}
