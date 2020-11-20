import request from '@/utils/request'
import Qs from "qs"
export function getList(params) {

    return request({
        url: '/user/queryList',
        method: 'post',
        data: params
    })
}
export function deleteRow(params) {

    return request({
        url: '/user/deleteUser',
        method: 'post',
        data: Qs.stringify(params)
    })
}
export function insertUser(params) {

    return request({
        url: '/user/insertUser',
        method: 'post',
        data: Qs.stringify(params)
    })
}
export function updateUser(params) {

    return request({
        url: '/user/updateUser',
        method: 'post',
        data: Qs.stringify(params)
    })
}