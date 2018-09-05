import * as types from './type';
import http from '../../api/http'
import {environment, getToken} from '../../api/environment'

const fetchUserList = (currentPage, pageSize) =>{
    let options = {
        data: {
            currentPage: currentPage,
            pageSize: pageSize
        },
        headers: {
            Authorization: getToken().authorization
        }
    }
    return http.post(environment.url.userList, options)
}

export const requestData = (currentPage, pageSize, dataType) => {
    return async dispatch => {
        try {
            let result = await fetchUserList(currentPage, pageSize);
            result.map(item => {
                return item;
            })
            dispatch({
                type: types.REQUESTUSERLIST,
                value: result,
                dataType
            })
        }catch (error){
            console.error(error)
        }
    }
}


