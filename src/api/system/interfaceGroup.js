/*
 * @Author: Weizheng
 * @Date: 2022-08-29 11:02:08
 * @LastEditTime: 2022-09-15 10:51:47
 * @LastEditors: WeiZheng
 * @Description: 
 * @FilePath: \petro-gsms-device-web\src\api\system\interfaceGroup.js
 */
import request from '@/utils/request'

export function addInterfaceGroup(data){
    return request({
        url:'/integrate/interfaceTeam/saveInterfaceTeam',
        method:'post',
        data:data
    })
}

export function getInterfaceGroup(data){
    return request({
        url:'/integrate/interfaceTeam/listInterfaceTeamByLike',
        method:'post',
        data:data
    })
}

export function deleteInterfaceGroup(ids){
    return request({
        url:'/integrate/interfaceTeam/deleteBatchInterfaceTeam',
        method:'post',
        data:ids
    })
}

export function getInterfaceGroupRelation(data){
    return request({
        url:'/integrate/interfaceInformation/listInterfaceInformationById',
        method:'post',
        data:data
    })
}

export function updateInterfaceGroup(data){
    return request({
        url:'/integrate/interfaceTeam/updateInterfaceTeam',
        method:'post',
        data:data
    })
}