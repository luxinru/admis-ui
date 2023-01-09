import request from "@/utils/request";

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
