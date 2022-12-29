import request from '@/utils/request'

// 查询转资前单据表列表
export function listDetail(query) {
  return request({
    url: '/value/add/financial/detail/list',
    method: 'get',
    params: query
  })
}

// 查询转资前单据表详细
export function getDetail(id) {
  return request({
    url: '/value/add/financial/detail/' + id,
    method: 'get'
  })
}

// 查询明细价值量数据
export function getValueList(id) {
  return request({
    url: '/value/add/financial/detail/value/' + id,
    method: 'get'
  })
}

// 新增转资前单据表
export function addDetail(data) {
  return request({
    url: '/value/add/financial/detail/add',
    method: 'post',
    data: data
  })
}

// 修改转资前单据表
export function updateDetail(data) {
  return request({
    url: '/value/add/financial/detail/edit',
    method: 'put',
    data: data
  })
}

// 删除转资前单据表
export function delDetail(id) {
  return request({
    url: '/value/add/financial/detail/remove/' + id,
    method: 'delete'
  })
}
