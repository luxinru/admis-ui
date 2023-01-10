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