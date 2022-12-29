import request from '@/utils/request'

// 查询房屋单据列表
export function listHouseRefineInvoice(query) {
  return request({
    url: '/assets/house/repair/invoice/list',
    method: 'get',
    params: query
  })
}

// 送审前校验单据下是否存在明细数据
export function checkSendAuditDetail(invoceNumbers) {
  return request({
    url: '/assets/house/repair/invoice/checkSendAuditDetail/'+invoceNumbers,
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

// 取回
export function cancelSendData(obj) {
  return request({
    url: '/assets/house/refine/invoice/cancelSend',
    method: 'put',
    data: obj
  })
}

// 删除房屋单据
export function delHouseRefineInvoice(selectInvoiceNumbers) {
  return request({
    url: '/assets/house/refine/invoice/remove/' + selectInvoiceNumbers,
    method: 'delete'
  })
}

// 审批操作--通过
export function approvalInvoiceAgree(obj) {
  return request({
    url: '/assets/house/repair/invoice/approvalInvoiceAgree',
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
    url: '/assets/house/repair/invoice/revocationData',
    method: 'put',
    data: obj
  })
}

// 退回
export function goBackData(obj) {
  return request({
    url: '/assets/house/repair/invoice/goBackData',
    method: 'put',
    data: obj
  })
}

// 实施维护完成
export function preserveFinishData(obj) {
  return request({
    url: '/assets/house/repair/invoice/preserveFinishData',
    method: 'put',
    data: obj
  })
}

// 单据编辑
export function updateDataByInvoiceNumber(data) {
  return request({
    url: '/assets/house/repair/invoice/updateDataByInvoiceNumber',
    method: 'post',
    data: data
  })
}
