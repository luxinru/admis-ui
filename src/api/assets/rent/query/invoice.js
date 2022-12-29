import request from '@/utils/request'

// 查询资产单据列表
export function listInvoice(query) {
  return request({
    url: '/assets/rent/apply/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询资产单据列表
export function getInvoice(id) {
  return request({
    url: '/assets/rent/query/invoice/' + id,
    method: 'get'
  })
}

// 新增资产单据
export function addInvoice(data, code, sysWorkDate) {
  return request({
    url: '/assets/rent/query/invoice/add?code=' + code + '&sysWorkDate=' + sysWorkDate,
    method: 'post',
    data: data
  })
}

// 修改资产单据
export function updateInvoice(data) {
  return request({
    url: '/assets/rent/query/invoice/update',
    method: 'put',
    data: data
  })
}

// 删除资产单据
export function delInvoice(id) {
  return request({
    url: '/assets/rent/query/invoice/remove/' + id,
    method: 'delete'
  })
}

// 送审资产单据
export function reportTo(id) {
  return request({
    url: '/assets/rent/query/invoice/send/' + id,
    method: 'put'
  })
}

// 审核资产单据
export function invoiceAudit(data) {
  return request({
    url: '/assets/rent/query/invoice/audit',
    method: 'put',
    data: data
  })
}

// 退回资产单据
export function handleBack(id) {
  return request({
    url: '/assets/rent/query/invoice/back/' + id,
    method: 'put'
  })
}
