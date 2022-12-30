import request from '@/utils/request'

export function fetchBasicStats(params) {
  return request({
    url: `data-visualization/house/visual/basic/stats/${params.departCode}`,
    method: 'get',
  })
}

export function fetchVisualAmount(params) {
  return request({
    url: `data-visualization/house/visual/amount/${params.departCode}`,
    method: 'get',
  })
}

export function fetchRentalGrowth(params) {
  return request({
    url: `data-visualization/house/visual/rental/growth`,
    method: 'get',
    params,
  })
}

export function fetchVisualPaper(params) {
  return request({
    url: `data-visualization/house/visual/paper/${params.departCode}`,
    method: 'get',
  })
}

export function fetchVisualRentalIncome(params) {
  return request({
    url: `data-visualization/house/visual/rental/income`,
    method: 'get',
    params,
  })
}

export function fetchVisualList(params) {
  return request({
    url: `data-visualization/house/visual/list`,
    method: 'get',
    params,
  })
}

export function fetchVisualRentHouse(params) {
  return request({
    url: `data-visualization/house/visual/rent/house`,
    method: 'get',
    params,
  })
}

export function fetchVisualReformHouse(params) {
  return request({
    url: `data-visualization/house/visual/reform/house/${params.houseCode}`,
    method: 'get',
    params,
  })
}

export function fetchVisualHouseAccount(params) {
  return request({
    url: `data-visualization/house/visual/house/account`,
    method: 'get',
    params,
  })
}

export function fetchMyrelationList(params) {
  return request({
    url: `/system/user/depart/myrelation`,
    method: 'get',
    params,
  })
}

export function fetchListFilesByKeyCode(params) {
  return request({
    url: `/file/file/listFilesByKeyCode`,
    method: 'get',
    params,
  })
}

export function fetchVisualAmountNature(params) {
  return request({
    url: `data-visualization/house/visual/amount/nature`,
    method: 'get',
    params,
  })
}

export function fetchVisualValueNature(params) {
  return request({
    url: `data-visualization/house/visual/value/nature`,
    method: 'get',
    params,
  })
}

export function fetchVisualValueRentDepart(params) {
  return request({
    url: `data-visualization/house/visual/value/rent/depart`,
    method: 'get',
    params,
  })
}

export function fetchVisualAmountRentDepart(params) {
  return request({
    url: `data-visualization/house/visual/amount/rent/depart`,
    method: 'get',
    params,
  })
}