import request from '@/utils/request'

// 查询部门拓展目录列表
export function listDeptExtend(query) {
  return request({
    url: '/system/depart/list',
    method: 'get',
    params: query
  })
}

// 查询列表(字典用)
export function listDictDeptExtend(query) {
  return request({
    url: '/system/depart/dictList',
    method: 'get',
    params: query
  })
}

// 查询部门拓展目录列表
export function listDeptExtendTree() {
  return request({
    url: '/system/depart/tree',
    method: 'get'
  })
}


// 查询部门拓展目录详细
export function getDeptExtend(id) {
  return request({
    url: '/system/depart/' + id,
    method: 'get'
  })
}

// 新增部门拓展目录
export function addDeptExtend(data) {
  return request({
    url: '/system/depart/add',
    method: 'post',
    data: data
  })
}

// 修改部门拓展目录
export function updateDeptExtend(data) {
  return request({
    url: '/system/depart/edit',
    method: 'put',
    data: data
  })
}

// 删除部门拓展目录
export function delDeptExtend(id) {
  return request({
    url: '/system/depart/remove/' + id,
    method: 'delete'
  })
}
