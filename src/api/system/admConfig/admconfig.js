import request from '@/utils/request'

// 查询参数表列表
export function listAdmConfig(query) {
  return request({
    url: '/system/admConfig/list',
    method: 'get',
    params: query
  })
}

// 查询参数表详细
export function getAdmConfig(id) {
  return request({
    url: '/system/admConfig/' + id,
    method: 'get'
  })
}

// 新增参数表
export function addAdmConfig(data) {
  return request({
    url: '/system/admConfig/add',
    method: 'post',
    data: data
  })
}

// 修改参数表
export function updateAdmConfig(data) {
  return request({
    url: '/system/admConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除参数表
export function delAdmConfig(id) {
  return request({
    url: '/system/admConfig/remove/' + id,
    method: 'get'
  })
}

  // 根据参数标识称获取参数
  export function getAdmConfigByname(data) {
    return request({
      url: '/system/admConfig/name',
      method: 'get',
      params: data
    })
  }
