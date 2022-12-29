import request from '@/utils/request'

// 通过id获取房屋卡片信息
export function listHouseQuery(query) {
  return request({
    url: '/assets/house/change/query/list',
    method: 'get',
    params: query
  })
}

// 退回资产单据
export function handleBack(id) {
  return request({
    url: '/assets/house/change/query/back/' + id,
    method: 'put'
  })
}

export function handleFindDiff(id) {
  return request({
    url: '/assets/house/change/query/findDifferent/' + id,
    method: 'put'
  })
}