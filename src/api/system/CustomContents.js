import request from '@/utils/request'

// 查询自定义资产目录表列表
export function listCustomContents(query) {
  return request({
    url: '/system/assets/contents/custom/list',
    method: 'get',
    params: query
  })
}

// 查询自定义资产目录表列表
export function listLevelCustomContents(query) {
  return request({
    url: '/system/assets/contents/custom/listCustom',
    method: 'post',
    params: query
  })
}

// 查询自定义资产目录表详细
export function getCustomContents(id) {
  return request({
    url: '/system/assets/contents/custom/' + id,
    method: 'get'
  })
}

// 新增自定义资产目录表
export function addCustomContents(data) {
  return request({
    url: '/system/assets/contents/custom/add',
    method: 'post',
    data: data
  })
}

// 修改自定义资产目录表
export function updateCustomContents(data) {
  return request({
    url: '/system/assets/contents/custom/edit',
    method: 'put',
    data: data
  })
}

// 删除自定义资产目录表
export function delCustomContents(id) {
  return request({
    url: '/system/assets/contents/custom/remove/' + id,
    method: 'delete'
  })
}
