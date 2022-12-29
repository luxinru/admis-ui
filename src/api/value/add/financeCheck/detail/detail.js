import request from '@/utils/request'

// 查询实物核对明细列表
export function listDetail(query) {
    return request({
        url: '/value/add/financeCheck/detail/list',
        method: 'get',
        params: query
    })
}

// 查询实物核对明细详细
export function getDetail(id) {
    return request({
        url: '/value/add/financeCheck/detail/' + id,
        method: 'get'
    })
}

// 判断是否相符
export function changeCheckStatus(keyCode,id, valueCheckResult) {
    const data = {
        keyCode,
        id,
        valueCheckResult
    }
    return request({
        url: '/value/add/financeCheck/detail/changeStatus',
        method: 'put',
        data: data
    })
}

// 修改转资前明细表
export function updateDetail(data) {
    return request({
        url: '/value/add/financeCheck/detail/edit',
        method: 'put',
        data: data
    })
}
