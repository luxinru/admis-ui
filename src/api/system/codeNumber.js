import request from '@/utils/request'
// 查询字典数据
export function getDepreciateArea(query) {
  return request({
    url: '/system/serial/getDepreciateArea',
    method: 'get',
    params: query
  })
}
