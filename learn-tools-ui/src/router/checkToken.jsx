import React from 'react';
import { hashHistory } from 'react-router'
import {environment ,getToken} from "../api/environment";
import http from '../api/http';

/**
 * 每次进去项目之前校验token可用性
 */

export const checkToken = () => {
    /**************** 开启api校验 ****************/
    const authorization =  getToken().authorization;
    if(authorization == "") {
        hashHistory.replace( '/login' )
    }
    let options = {
        headers: {
            Authorization: authorization
        }
    }
    http.head(environment.url.checkAuth, options).then(() => {
        // 说明校验成功，不做任何处理 //
    }).catch(() => {
        hashHistory.replace( '/login' )
    })
}