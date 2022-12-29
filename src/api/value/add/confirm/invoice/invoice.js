import request from '@/utils/request'

// 查询使用状态确认单据表列表
export function listInvoice(query) {
  return request({
    url: '/value/add/confirm/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询使用状态确认单据表详细
export function getInvoice(id) {
  return request({
    url: '/value/add/confirm/invoice/' + id,
    method: 'get'
  })
}


// 审核使用状态确认单据
export function checkInvoice(data) {
  return request({
    url: '/value/add/confirm/invoice/check',
    method: 'put',
    data: data
  })
}
