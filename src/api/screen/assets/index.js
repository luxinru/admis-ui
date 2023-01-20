import request from "@/utils/request";

// 1.1.	统计单位信息获取
export function fetchDepartList(params) {
  return request({
    url: `data-visualization/assets/visual/depart/list`,
    method: "get",
    params,
  });
}

// 1.3.	资产总量统计
export function fetchDictList(params) {
  return request({
    url: `data-visualization/assets/visual/dict/list`,
    method: "get",
    params,
  });
}

// 1.3.	资产总量统计
export function fetchAssetsCount(params) {
  return request({
    url: `data-visualization/assets/visual/assets/count`,
    method: "get",
    params,
  });
}

// 1.4.	本年业务统计
export function fetchBusinessCount(params) {
  return request({
    url: `data-visualization/assets/visual/business/count`,
    method: "get",
    params,
  });
}

// 1.5.	业务数据分析
export function fetchBusinessAnalysis(params) {
  return request({
    url: `data-visualization/assets/visual/business/analysis`,
    method: "get",
    params,
  });
}

// 1.6.	实物资产统计
export function fetchRealAssetsCount(params) {
  return request({
    url: `data-visualization/assets/visual/realAssets/count`,
    method: "get",
    params,
  });
}

// 1.7.	油气产量统计
export function fetchProductionCount(params) {
  return request({
    url: `data-visualization/assets/visual/production/count`,
    method: "get",
    params,
  });
}

// 1.9.	年折耗统计
export function fetchDepletionCount(params) {
  return request({
    url: `data-visualization/assets/visual/depletion/count`,
    method: "get",
    params,
  });
}

// 1.8.	资产分类统计
export function fetchTypeCount(params) {
  return request({
    url: `data-visualization/assets/visual/type/count`,
    method: "get",
    params,
  });
}

// 1.10.	区块统计
export function fetchBlockCount(params) {
  return request({
    url: `data-visualization/assets/visual/block/count`,
    method: "get",
    params,
  });
}

// 1.11.	分类统计
export function fetchClassCount(params) {
  return request({
    url: `data-visualization/assets/visual/class/count`,
    method: "get",
    params,
  });
}

// 1.12.	资产明细信息列表查询
export function fetchAssetsList(params) {
  return request({
    url: `data-visualization/assets/visual/assets/list`,
    method: "get",
    params,
  });
}

// 1.18.	资产分类数量占比查询接口
export function fetchAssetsAmount(params) {
  return request({
    url: `data-visualization/assets/visual/assets/amount`,
    method: "get",
    params,
  });
}

// 1.19.	资产分类价值量占比查询接口
export function fetchAssetsValue(params) {
  return request({
    url: `data-visualization/assets/visual/assets/value`,
    method: "get",
    params,
  });
}

// 1.14.	业务明细列表查询
export function fetchBusinessList(params) {
  return request({
    url: `data-visualization/assets/visual/business/list`,
    method: "get",
    params,
  });
}

// 1.20.	业务数量占比查询接口
export function fetchBusinessAmount(params) {
  return request({
    url: `data-visualization/assets/visual/business/amount`,
    method: "get",
    params,
  });
}

// 1.15.	油气产量明细列表查询
export function fetchProductionList(params) {
  return request({
    url: `data-visualization/assets/visual/production/list`,
    method: "get",
    params,
  });
}

// 1.21.	油气产量分类占比查询接口
export function fetchProductionValue(params) {
  return request({
    url: `data-visualization/assets/visual/production/value`,
    method: "get",
    params,
  });
}

// 1.16.	折耗明细列表查询
export function fetchDepletionList(params) {
  return request({
    url: `data-visualization/assets/visual/depletion/list`,
    method: "get",
    params,
  });
}

// 1.22.	折耗量分类占比查询接口
export function fetchDepletionValue(params) {
  return request({
    url: `data-visualization/assets/visual/depletion/value`,
    method: "get",
    params,
  });
}

// 1.17.	出租明细列表查询
export function fetchRentList(params) {
  return request({
    url: `data-visualization/assets/visual/rent/list`,
    method: "get",
    params,
  });
}

// 1.23.	出租承租单位性质数量占比查询接口
export function fetchRentAmount(params) {
  return request({
    url: `data-visualization/assets/visual/rent/amount`,
    method: "get",
    params,
  });
}

// 1.24.	房屋出租承租单位性质价值量占比查询接口
export function fetchRentValue(params) {
  return request({
    url: `data-visualization/assets/visual/rent/value`,
    method: "get",
    params,
  });
}

