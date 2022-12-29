import request from '@/utils/request'

// 查询实物核对明细列表
export function listDetail(query) {
  return request({
    url: '/value/add/goodsCheck/detail/list',
    method: 'get',
    params: query
  })
}

// 查询实物核对明细详细
export function getDetail(id) {
  return request({
    url: '/value/add/goodsCheck/detail/' + id,
    method: 'get'
  })
}

// 判断是否相符
export function changeCheckStatus(keyCode,id, goodsCheckResult) {
  const data = {
    keyCode,
    id,
    goodsCheckResult
  }
  return request({
    url: '/value/add/goodsCheck/detail/changeStatus',
    method: 'put',
    data: data
  })
}


