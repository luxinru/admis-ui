import request from '@/utils/request'

// 查询参数表列表
export function listPrivateConfig(query) {
  return request({
      url: '/system/adpConfig/private/list',
      method: 'get',
      params: query
  })
}

// 查询参数表详细
export function getPrivateConfig(id) {
    return request({
        url: '/system/adpConfig/private/' + id,
        method: 'get'
    })
}

// 新增参数表
export function addPrivateConfig(data) {
    return request({
        url: '/system/adpConfig/private/add',
        method: 'post',
        data: data
    })
}

// 修改参数表
export function updatePrivateConfig(data) {
    return request({
        url: '/system/adpConfig/private/edit',
        method: 'put',
        data: data
    })
}

// 删除参数表
export function delPrivateConfig(id) {
    return request({
        url: '/system/adpConfig/private/remove/' + id,
        method: 'delete'
    })
}

