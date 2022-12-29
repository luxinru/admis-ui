import request from '@/utils/request'

// 查询转资前单据表列表
export function listInvoice(query) {
  return request({
    url: '/value/add/assetsquery/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询转资前单据表详细
export function getInvoice(invoiceNumber) {
  return request({
    url: '/value/add/assetsquery/invoice/' + invoiceNumber,
    method: 'get'
  })
}

// 新增转资前单据表
export function addInvoice(data) {
  return request({
    url: '/value/add/assetsquery/invoice/add',
    method: 'post',
    data: data
  })
}

// 修改转资前单据表
export function updateInvoice(data) {
  return request({
    url: '/value/add/assetsquery/invoice/edit',
    method: 'put',
    data: data
  })
}

// 提交
export function commitPhysicalInvoice(obj) {
  return request({
    url: '/value/add/assetsquery/invoice/commitPhysical',
    method: 'put',
    data: obj
  })
}

// 退回
export function rollbackInvoice(obj) {
  return request({
    url: '/value/add/assetsquery/invoice/rollback',
    method: 'put',
    data: obj
  })
}
