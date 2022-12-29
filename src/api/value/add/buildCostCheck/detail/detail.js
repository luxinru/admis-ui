import request from '@/utils/request'

// 查询实物核对明细列表
export function listDetail(query) {
  return request({
    url: '/value/add/buildCostCheck/detail/list',
    method: 'get',
    params: query
  })
}

// 查询实物核对明细详细
export function getDetail(id) {
  return request({
    url: '/value/add/buildCostCheck/detail/' + id,
    method: 'get'
  })
}

// 修改转资前明细表
export function updateDetail(data) {
  console.log(data);
  return request({
    url: '/value/add/buildCostCheck/detail/edit',
    method: 'put',
    data: data
  })
}


