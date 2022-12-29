/*
 * @Author: Weizheng
 * @Date: 2022-08-25 15:04:36
 * @LastEditTime: 2022-09-05 11:32:57
 * @LastEditors: WeiZheng
 * @Description: 
 * @FilePath: \petro-gsms-device-web\src\api\system\interface.js
 */
import request from '@/utils/request'

export function listInterface(data){
    return request({
        // url:'/integrate/interfaceInformation/listInterfaceInformation',
        url:'/integrate/interfaceInformation/listInterfaceInformationByLike',
        method:'post',
        data:data
    })
}


export function addInterface(data){
    return request({
        url:'/integrate/interfaceInformation/saveInterfaceInformation',
        method:'post',
        data:data
    })
}

export function deleteInterface(ids){
    return request({
        url:'/integrate/interfaceInformation/deleteInterfaceInformation',
        method:'post',
        data:ids
    })
}

export function updateInterface(data){
    return request({
        url:'/integrate/interfaceInformation/updateInterfaceInformation',
        method:'post',
        data:data,
    })
}
