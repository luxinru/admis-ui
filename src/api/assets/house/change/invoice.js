import request from '@/utils/request'

// 通过id获取房屋卡片信息
export function getHouseRefineDetail(keyCode) {
    return request({
      url: '/assets/house/change/invoice/detailData/' + keyCode,
      method: 'get'
    })
  }

  
// 修改房屋单据
export function updateHouseRefineDeatil(data) {
  return request({
    url: '/assets/house/change/invoice/update',
    method: 'put',
    data: data
  })
}