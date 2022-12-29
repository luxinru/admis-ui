import request from '@/utils/request'
// 根据分类编码查询字典数据信息
export function getCodeData(query) {
  return request({
    url: '/system/sysComplexCode/list',
    method: 'get',
    params: query
  })
}
  // 根据分类编码查询字典数据信息
  export function getChildData(query) {
    return request({
      url: '/system/sysComplexCode/childList',
      method: 'get',
      params: query
    })
}

