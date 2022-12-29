import request from '@/utils/request'

// 查询实物核对单据表列表
export function listInvoice(query) {
  return request({
    url: '/value/add/realCheck/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询实物核对单据表详细
export function getInvoice(id) {
  return request({
    url: '/value/add/realCheck/invoice/' + id,
    method: 'get'
  })
}


// 审核实物核对单据
export function checkInvoice(data) {
  return request({
    url: '/value/add/realCheck/invoice/check',
    method: 'put',
    data: data
  })
}
