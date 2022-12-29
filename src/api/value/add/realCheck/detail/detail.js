import request from '@/utils/request'

// 查询实物核对明细列表
export function listDetail(query) {
  return request({
    url: '/value/add/realCheck/detail/list',
    method: 'get',
    params: query
  })
}

// 查询实物核对明细详细
export function getDetail(id) {
  return request({
    url: '/value/add/realCheck/detail/' + id,
    method: 'get'
  })
}

// 判断是否相符
export function changeCheckStatus(keyCode,id, realCheckResult) {
  const data = {
    keyCode,
    id,
    realCheckResult
  }
  return request({
    url: '/value/add/realCheck/detail/changeStatus',
    method: 'put',
    data: data
  })
}

export function checkImgCount(busType,invoiceNumber,keyCode) {
  const data = {
    busType,
    invoiceNumber,
    keyCode
  }
  return request({
    url: '/file/file/checkImgCount',
    method: 'put',
    data: data
  })
}




