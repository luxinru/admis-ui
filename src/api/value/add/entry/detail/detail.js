import request from '@/utils/request'

// 查询转资前明细表列表
export function listDetail(query) {
  return request({
    url: '/value/add/entry/detail/list',
    method: 'get',
    params: query
  })
}

// 查询转资前明细表详细
export function getDetail(id) {
  return request({
    url: '/value/add/entry/detail/' + id,
    method: 'get'
  })
}

// 新增转资前明细表
export function addDetail(data) {
  return request({
    url: '/value/add/entry/detail/add',
    method: 'post',
    data: data
  })
}

// 新增转资前明细表
export function addDetailList(data) {
  return request({
    url: '/value/add/entry/detail/addList',
    method: 'post',
    data: data
  })
}

// 修改转资前明细表
export function updateDetail(data) {
  return request({
    url: '/value/add/entry/detail/edit',
    method: 'put',
    data: data
  })
}

// 删除转资前明细表
export function delDetail(id) {
  return request({
    url: '/value/add/entry/detail/remove/' + id,
    method: 'delete'
  })
}
