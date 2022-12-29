import request from '@/utils/request'

//获取上传图片URL
export function imgList(query) {
    return request({
        url: '/file/file/imgList',
        method: 'get',
        params: query
    })
}

//删除上传图片
export function removeImgFile(id) {
    return request({
        url: '/file/file/removeImgFile/'+ id,
        method: 'delete'
    })
}