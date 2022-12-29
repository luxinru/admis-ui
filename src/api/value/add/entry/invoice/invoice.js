import request from '@/utils/request'

// 查询转资前单据表列表
export function listInvoice(query) {
  return request({
    url: '/value/add/entry/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询转资前单据表详细
export function getInvoice(invoiceNumber) {
  return request({
    url: '/value/add/entry/invoice/' + invoiceNumber,
    method: 'get'
  })
}

// 新增转资前单据表
export function addInvoice(data) {
  return request({
    url: '/value/add/entry/invoice/add',
    method: 'post',
    data: data
  })
}

// 修改转资前单据表
export function updateInvoice(data) {
  return request({
    url: '/value/add/entry/invoice/edit',
    method: 'put',
    data: data
  })
}

// 删除转资前单据表
export function delInvoice(deleteNumbers) {
  return request({
    url: '/value/add/entry/invoice/remove/' + deleteNumbers,
    method: 'delete'
  })
}

// 送审转资前单据表
export function commitInvoice(commitNumbers) {
  return request({
    url: '/value/add/entry/invoice/commit/'+ commitNumbers,
    method: 'put'
  })
}

// 撤回转资前单据表
export function rollbackInvoice(rollbackNumbers) {
  return request({
    url: '/value/add/entry/invoice/rollback/'+ rollbackNumbers,
    method: 'put'
  })
}