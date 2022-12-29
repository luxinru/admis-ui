import request from '@/utils/request'

// 查询已核销探井台账表列表
export function listWell(query) {
  return request({
    url: '/assets/add/list',
    method: 'get',
    params: query
  })
}