import request from '@/utils/request'

// 查询参数表列表
export function listPublicConfig(query) {
  return request({
      url: '/system/adpConfig/public/list',
      method: 'get',
      params: query
  })
}

// 查询参数表详细
export function getPublicConfig(id) {
    return request({
        url: '/system/adpConfig/public/' + id,
        method: 'get'
    })
}

// 新增参数表
export function addPublicConfig(data) {
    return request({
        url: '/system/adpConfig/public/add',
        method: 'post',
        data: data
    })
}

// 修改参数表
export function updatePublicConfig(data) {
    return request({
        url: '/system/adpConfig/public/edit',
        method: 'put',
        data: data
    })
}

// 删除参数表
export function delPublicConfig(id) {
    return request({
        url: '/system/adpConfig/public/remove/' + id,
        method: 'delete'
    })
}

