import request from '@/utils/request'


export function listDetail(query) {
  return request({
    url: '/account/choose/assets/list',
    method: 'get',
    params: query
  })
}

export function listHouse(query) {
  return request({
    url: '/account/choose/assets/house/list',
    method: 'get',
    params: query
  })
}

export function listColumn(purpose) {
  return request({
    url: '/account/choose/assets/column/list/' + purpose,
    method: 'get',
  })
}
