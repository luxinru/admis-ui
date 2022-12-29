import request from '@/utils/request'

// 查询标准化资产目录表列表
export function listSerial(query) {
  return request({
    url: '/system/serial/list',
    method: 'get',
    params: query
  })
}

// 查询标准化资产目录表详细
export function getSerial(id) {
  return request({
    url: '/system/serial/' + id,
    method: 'get'
  })
}

// 新增标准化资产目录表
export function addSerial(data) {
  return request({
    url: '/system/serial/add',
    method: 'post',
    data: data
  })
}

// 修改标准化资产目录表
export function updateSerial(data) {
  return request({
    url: '/system/serial/edit',
    method: 'put',
    data: data
  })
}

// 删除标准化资产目录表
export function delSerial(id) {
  return request({
    url: '/system/serial/remove/' + id,
    method: 'delete'
  })

}
