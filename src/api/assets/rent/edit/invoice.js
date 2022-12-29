import request from '@/utils/request'

// 查询资产单据列表
export function listInvoice(query) {
  return request({
    url: '/assets/rent/edit/invoice/list',
    method: 'get',
    params: query
  })
}

// 送审资产单据
export function sendInvoice(id) {
  return request({
    url: '/assets/rent/edit/invoice/send/' + id,
    method: 'put'
  })
}

