/*
 * @Author: Weizheng
 * @Date: 2022-04-25 10:44:01
 * @LastEditTime: 2022-04-25 10:44:02
 * @LastEditors: WeiZheng
 * @Description: 
 * @FilePath: \ruoyi-ui\src\utils\sessionStorage.js
 */
export function getSessionStorage(key) {
  return sessionStorage.getItem(key);
}

export function setSessionStorage(key,value) {
  return sessionStorage.setItem(key,value);
}

export function removeSessionStorage(key) {
  return sessionStorage.removeItem(key);
}
