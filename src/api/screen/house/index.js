import request from '@/utils/request'

// 1.1.	 基本统计查询接口（完成）
export function fetchBasicStats(params) {
  return request({
    url: `data-visualization/house/visual/basic/stats/${params.departCode}`,
    method: 'get',
  })
}


// 1.2.	 房屋总量占比查询接口（完成）
export function fetchVisualAmount(params) {
  return request({
    url: `data-visualization/house/visual/amount/proportion`,
    method: 'get',
    params
  })
}


// 1.3.	 租金增长率查询接口(完成）
export function fetchRentalGrowth(params) {
  return request({
    url: `data-visualization/house/visual/rental/growth`,
    method: 'get',
    params,
  })
}


// 1.5.	 房证取得情况查询(完成)
export function fetchVisualPaper(params) {
  return request({
    url: `data-visualization/house/visual/paper/${params.departCode}`,
    method: 'get',
  })
}


// 1.4.	 租金收入占比查询接口(完成)
export function fetchVisualRentalIncome(params) {
  return request({
    url: `data-visualization/house/visual/rental/income`,
    method: 'get',
    params,
  })
}


// 1.6.	 房屋信息查询接口（完成）
export function fetchVisualList(params) {
  return request({
    url: `data-visualization/house/visual/list`,
    method: 'get',
    params,
  })
}


// 1.7.	房屋出租信息查询接口（完成）
export function fetchVisualRentHouse(params) {
  return request({
    url: `data-visualization/house/visual/rent/house`,
    method: 'get',
    params,
  })
}


// 1.8.	 房屋改造信息接口
export function fetchVisualReformHouse(params) {
  return request({
    url: `data-visualization/house/visual/reform/house/${params.houseCode}`,
    method: 'get',
    params,
  })
}


// 1.9.	房屋信息台账明细查询
export function fetchVisualHouseAccount(params) {
  return request({
    url: `data-visualization/house/visual/house/account`,
    method: 'get',
    params,
  })
}

// 获取单位列表接口
export function fetchMyrelationList(params) {
  return request({
    url: `/system/user/depart/myrelation`,
    method: 'get',
    params,
  })
}

// 获取房屋图片信息
export function fetchListFilesByKeyCode(params) {
  return request({
    url: `/file/file/listFilesByKeyCode`,
    method: 'get',
    params,
  })
}


// 1.10.	房屋使用性质数量占比查询接口
export function fetchVisualAmountNature(params) {
  return request({
    url: `data-visualization/house/visual/amount/nature`,
    method: 'get',
    params,
  })
}


// 1.11.	房屋使用性质价值量占比查询接口
export function fetchVisualValueNature(params) {
  return request({
    url: `data-visualization/house/visual/value/nature`,
    method: 'get',
    params,
  })
}

// 1.12.	房屋出租承租单位性质数量占比查询接口
export function fetchVisualValueRentDepart(params) {
  return request({
    url: `data-visualization/house/visual/value/rent/depart`,
    method: 'get',
    params,
  })
}


// 1.13.	房屋出租承租单位性质价值量占比查询接口
export function fetchVisualAmountRentDepart(params) {
  return request({
    url: `data-visualization/house/visual/amount/rent/depart`,
    method: 'get',
    params,
  })
}