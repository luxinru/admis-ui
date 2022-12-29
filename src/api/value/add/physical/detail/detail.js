import request from '@/utils/request'

// 查询转资前单据表列表
export function listDetail(query) {
  return request({
    url: '/value/add/physical/detail/list',
    method: 'get',
    params: query
  })
}

// 查询转资前单据表详细
export function getDetail(id) {
  return request({
    url: '/value/add/physical/detail/' + id,
    method: 'get'
  })
}

// 新增转资前单据表
export function addDetail(data) {
  return request({
    url: '/value/add/physical/detail/add',
    method: 'post',
    data: data
  })
}

// 修改转资前单据表
export function updateDetail(data) {
  return request({
    url: '/value/add/physical/detail/edit',
    method: 'put',
    data: data
  })
}

// 删除转资前单据表
export function delDetail(id) {
  return request({
    url: '/value/add/physical/detail/remove/' + id,
    method: 'delete'
  })
}

// 整合
export function intergrationAssetsData(data) {
  return request({
    url: '/value/add/physical/detail/intergration',
    method: 'post',
    data: data
  })
}

// 取消整合
export function unIntergrationAssetsData(data) {
  return request({
    url: '/value/add/physical/detail/unIntergration',
    method: 'post',
    data: data
  })
}
