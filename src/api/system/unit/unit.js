/*
 * @Author: xu0129 417990035@qq.com
 * @Date: 2022-09-01 14:00:18
 * @LastEditors: xu0129 417990035@qq.com
 * @LastEditTime: 2022-12-27 10:28:42
 * @FilePath: \admis-ui\src\api\system\unit\unit.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 查询用户部门表列表
export function listUserDept(query) {
  return request({
    url: '/system/user/depart/list',
    method: 'get',
    params: query
  })
}


export function test(houseCode) {
  return request({
    url: '/data-visualization/house/visual/house/archives/'+ houseCode,
    method: 'get',
  })
}

