import request from '@/utils/request'

// 新增房屋单据
export function addHouseRefineInvoice(data) {
  return request({
    url: '/assets/house/refine/invoice/add',
    method: 'post',
    data: data
  })
}

// 修改房屋单据
export function updateHouseRefineInvoice(data) {
  return request({
    url: '/assets/house/refine/invoice/update',
    method: 'put',
    data: data
  })
}

// 查询房屋单据详细
export function getHouseRefineInvoice(invoiceNumber) {
  return request({
    url: '/assets/house/refine/invoice/invoiceData/' + invoiceNumber,
    method: 'get'
  })
}

// -----------------中间主资产部分脚本-----------------
// 查询主资产数据
export function getAssetsGetList(query) {
  return request({
    url: '/assets/house/refine/assets/detail/detailList/',
    method: 'get',
    params: query
  })
}
// 删除主资产数据
export function delAssetsDetail(obj) {
  return request({
    url: '/assets/house/refine/assets/detail/deleteByAssetsCode',
    method: 'put',
    data: obj
  });
}
// ------------------最下方，房屋资产信息脚本-----------------------
// 申请页面--查询房屋细化资产列表数据--查询的是房屋附属台账表
export function getHouseRefineGetList(query) {
  return request({
    url: '/assets/house/refine/detail/applyList',
    method: 'get',
    params: query
  })
}
// 申请页面--查询房屋细化资产列表数据--查询的是房屋附属台账表
export function auditAndQueryGetHouseRefineGetList(query) {
  return request({
    url: '/assets/house/refine/detail/list',
    method: 'get',
    params: query
  })
}
// 新增再次细化数据
export function addAgainRefineData(data) {
  return request({
    url: '/assets/house/refine/detail/addAgainRefine',
    method: 'post',
    data: data
  })
}
// 新增房屋细化子资产
export function addHouseRefineDeatil(data) {
  return request({
    url: '/assets/house/refine/detail/add',
    method: 'post',
    data: data
  })
}
// 复制房屋细化子资产
export function copyHouseRefineDeatil(data) {
  return request({
    url: '/assets/house/refine/detail/copy',
    method: 'post',
    data: data
  })
}
// 修改房屋单据
export function updateHouseRefineDeatil(data) {
  return request({
    url: '/assets/house/refine/detail/update',
    method: 'put',
    data: data
  })
}
// 通过资产编码row.assetsCode 异步请求后端，获取最大新细化资产编码
export function selectMaxAssetsRefineCode(assetsCode) {
  return request({
    url: '/assets/house/refine/detail/selectMaxAssetsRefineCode/' + assetsCode,
    method: 'get'
  })
}
// 通过id获取房屋卡片信息
export function getHouseRefineDetail(id) {
  return request({
    url: '/assets/house/refine/detail/detailData/' + id,
    method: 'get'
  })
}
// 删除房屋卡片数据
export function delHouseRefineDetail(obj) {
    return request({
        url: '/assets/house/refine/detail/deteleHouseRefineAssetsData',
        method: 'put',
        data: obj
    })
}

// ---------------------查询页面撤销功能---------------------------
// 撤销主资产数据
export function cancelAssetsData(obj) {
  return request({
    url: '/assets/house/refine/assets/detail/cancelHouseAssetsData',
    method: 'put',
    data: obj
  })
}
// 撤销房屋细化资产数据
export function cancelHouseRefineAssetsData(obj) {
  return request({
    url: '/assets/house/refine/detail/cancelHouseRefineAssetsData',
    method: 'put',
    data: obj
  })
}
// 选资产后，新增主资产数据前校验
export function checkAssetsData(data) {
  return request({
    url: '/assets/house/refine/assets/detail/checkAddAssets',
    method: 'post',
    data: data
  })
}
// 选资产后，新增主资产数据
export function addAssetsData(data) {
  return request({
    url: '/assets/house/refine/assets/detail/addAssets',
    method: 'post',
    data: data
  })
}
