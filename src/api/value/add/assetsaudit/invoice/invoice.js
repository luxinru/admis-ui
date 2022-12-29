import request from '@/utils/request'

// 查询转资前单据表列表
export function listInvoice(query) {
  return request({
    url: '/value/add/assetsaudit/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询转资前单据表详细
export function getInvoice(invoiceNumber) {
  return request({
    url: '/value/add/assetsaudit/invoice/' + invoiceNumber,
    method: 'get'
  })
}

// 新增转资前单据表
export function addInvoice(data) {
  return request({
    url: '/value/add/assetsaudit/invoice/add',
    method: 'post',
    data: data
  })
}

// 修改转资前单据表
export function updateInvoice(data) {
  return request({
    url: '/value/add/assetsaudit/invoice/edit',
    method: 'put',
    data: data
  })
}

// 送审
export function commitFinancialInvoice(obj) {
  return request({
    url: '/value/add/assetsaudit/invoice/commitFinancial',
    method: 'put',
    data: obj
  })
}

// 审批
export function auditInvoice(obj) {
  return request({
    url: '/value/add/assetsaudit/invoice/audit',
    method: 'put',
    data: obj
  })
}
