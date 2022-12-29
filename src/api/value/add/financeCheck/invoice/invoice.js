import request from '@/utils/request'

// 查询财务核对单据表列表
export function listInvoice(query) {
    return request({
        url: '/value/add/financeCheck/invoice/list',
        method: 'get',
        params: query
    })
}

// 查询财务核对单据表详细
export function getInvoice(id) {
    return request({
        url: '/value/add/financeCheck/invoice/' + id,
        method: 'get'
    })
}


// 审核财务核对单据
export function checkInvoice(data) {
    return request({
        url: '/value/add/financeCheck/invoice/check',
        method: 'put',
        data: data
    })
}
