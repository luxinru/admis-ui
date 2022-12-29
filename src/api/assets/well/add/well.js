import request from '@/utils/request'

// 查询已核销探井台账表列表
export function listWell(query) {
  return request({
    url: '/assets/add/list',
    method: 'get',
    params: query
  })
}

// 新增已核销探井台账表
export function addWell(data) {
  return request({
    url: '/assets/add/add',
    method: 'post',
    data: data
  })
}

// 修改已核销探井台账表
export function updateWell(data) {
  return request({
    url: '/assets/add/update',
    method: 'put',
    data: data
  })
}

// 删除已核销探井台账表
export function delWell(id) {
  return request({
    url: '/assets/add/remove/' + id,
    method: 'delete'
  })
}

// 查询
export function getWell(id) {
  return request({
    url: '/assets/add/' + id,
    method: 'get'
  })
}
