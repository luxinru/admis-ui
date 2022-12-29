import request from '@/utils/request'

// 查询房屋单据列表
export function listHouseRefineInvoice(query) {
  return request({
    url: '/assets/house/refine/invoice/list',
    method: 'get',
    params: query
  })
}

// 删除房屋单据
export function delHouseRefineInvoice(selectInvoiceNumbers) {
  return request({
    url: '/assets/house/refine/invoice/remove/' + selectInvoiceNumbers,
    method: 'delete'
  })
}

// 送审前校验单据下是否存在明细数据
export function checkSendAuditDetail(invoceNumbers) {
  return request({
    url: '/assets/house/refine/invoice/checkSendAuditDetail/'+invoceNumbers,
    method: 'get'
  })
}
// 送审操作
export function sendInvoice(selectInvoiceNumbers) {
  return request({
    url: '/assets/house/refine/invoice/sendInvoice/'+selectInvoiceNumbers,
    method: 'put'
  })
}
// 审批操作--通过
export function approvalInvoiceAgree(obj) {
  return request({
    url: '/assets/house/refine/invoice/approvalInvoiceAgree',
    method: 'put',
    data: obj
  })
}
// 审批操作--否决
export function approvalInvoiceUnAgree(obj) {
  return request({
    url: '/assets/house/refine/invoice/approvalInvoiceUnAgree',
    method: 'put',
    data: obj
  })
}
// 撤销操作
export function revocationInvoiceData(obj) {
  return request({
    url: '/assets/house/refine/invoice/revocationData',
    method: 'put',
    data: obj
  })
}

// 退回
export function cancelSendData(obj) {
  return request({
    url: '/assets/house/refine/invoice/cancelSend',
    method: 'put',
    data: obj
  })
}
