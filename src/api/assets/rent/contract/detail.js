import request from '@/utils/request'

// 查询资产明细列表
export function getDetailDetail(query) {
  return request({
    url: '/assets/rent/contract/list',
    method: 'get',
    params: query
  })
}
// 新增资产明细
export function addDetail(data) {
  return request({
    url: '/assets/rent/contract/add',
    method: 'post',
    data: data
  })
}
// 查询资产明细详细
export function getDetail(id) {
  return request({
    url: '/assets/rent/contract/' + id,
    method: 'get'
  })
}

// 修改资产明细
export function updateDetail(data) {
  return request({
    url: '/assets/rent/contract/update',
    method: 'put',
    data: data
  })
}

// 删除资产明细
export function delDetail(id) {
  return request({
    url: '/assets/rent/contract/remove/' + id,
    method: 'delete'
  })
}
