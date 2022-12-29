import request from '@/utils/request'

// 通过id获取房屋卡片信息
export function getHouseRefineDetail(id) {
    return request({
      url: '/assets/house/refine/detail/detailData/' + id,
      method: 'get'
    })
  }

// 修改房屋单据
export function updateHouseRefineDeatil(data) {
  return request({
    url: '/assets/house/change/detail/update',
    method: 'put',
    data: data
  })
}

// 新增房屋单据
export function addHouseRefineDeatil(data) {
  return request({
    url: '/assets/house/refine/detail/add',
    method: 'post',
    data: data
  })
}

// 修改房屋单据
export function updateManyHouseRefineDeatil(data,id) {
  return request({
    url: '/assets/house/change/detail/manyUpdate/' + id,
    method: 'put',
    data: data
  })
}