import request from '@/utils/request'

// 查询使用状态确认明细列表
export function listDetail(query) {
  return request({
    url: '/value/add/confirm/detail/list',
    method: 'get',
    params: query
  })
}

// 查询使用状态确认明细详细
export function getDetail(id) {
  return request({
    url: '/value/add/confirm/detail/' + id,
    method: 'get'
  })
}

// 判断是否相符
export function changeCheckStatus(keyCode,id, confirmResult) {
  const data = {
    keyCode,
    id,
    confirmResult
  }
  return request({
    url: '/value/add/confirm/detail/changeStatus',
    method: 'put',
    data: data
  })
}

// 修改确认明细表
export function updateDetail(data) {
  return request({
    url: '/value/add/confirm/detail/edit',
    method: 'put',
    data: data
  })
}

// 修改投产日期
export function updateOperateDate(data) {
  return request({
    url: '/value/add/confirm/detail/editOperateDate',
    method: 'put',
    data: data
  })
}



