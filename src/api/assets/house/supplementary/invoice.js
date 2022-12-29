import request from '@/utils/request'

// 查询补录资产列表数据
export function assetsList(query) {
  return request({
    url: '/assets/house/supplementary/list',
    method: 'get',
    params: query
  })
}

// 提交补录数据
export function submitSupplementaryData(obj) {
  return request({
    url: '/assets/house/supplementary/submitData',
    method: 'put',
    data: obj
  })
}

// 房屋补录数据保存
export function saveHouseSupplementaryRecordData(data) {
  return request({
    url: '/assets/house/supplementary/save',
    method: 'post',
    data: data
  })
}

// 房屋补录提交前校验
export function submitHouseSupplementaryRecordDataCheck(keyCodes) {
  return request({
    url: '/assets/house/supplementary/submitHouseSupplementaryRecordDataCheck/' + keyCodes,
    method: 'put'
  })
}

// 房屋补录提交
export function submitHouseSupplementaryRecordData(keyCodes) {
  return request({
    url: '/assets/house/supplementary/submitHouseSupplementaryRecordData/' + keyCodes,
    method: 'put'
  })
}
