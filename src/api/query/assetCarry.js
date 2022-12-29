import request from '@/utils/request'

// 查询字典数据列表
export function listAssetCarry(query) {
  debugger;
    return request({
      url: '/data-visualization/bill/query/list',
      method: 'get',
      params: query
    })
  }

  // 查询标准化,资产目录表列表
export function listAesst(query) {
  return request({
    url: '/system/asset/list/param',
    method: 'get',
    params: query
  })
}