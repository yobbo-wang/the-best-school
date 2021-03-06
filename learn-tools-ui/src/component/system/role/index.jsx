'use strict';
import React from 'react';
import {Table, Button, Loading, Message} from 'element-react'
import Add from './add';
import {requestRoleData, changeStatus} from "../../../store/sys/role/action";
import {connect} from "react-redux";
import {fetchMenuList} from "../../../store/sys/menu/action";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: [],
            row:{
                dialogVisible: false
            },
            columns: [
                {label: "角色名", prop: "name", width: 180},
                {label: "用户状态", prop: "status", width: 150, render: (data) => {
                        return data.status == "0" ? "激活" : "弃用";
                    }},
                {label: "创建人", prop: "createUserName", width: 160},
                {label: "创建时间", prop: "createTime", width: 160},
                {
                    label: "操作",
                    prop: "operation",
                    render: (data) => {
                        return (
                            <span>
                                <Button type="primary" icon="edit" size="small" onClick={() =>
                                    this.setState({row: {dialogVisible: true, form: {name: data.name, id: data.id}} })}>编辑</Button>
                                {data.status == "1" ?
                                    <Button type="success" icon="check" size="small" onClick={this.editRoleStatus.bind(this, data.id, '0') } >激活角色</Button> :
                                    <Button type="danger" icon="close" size="small" onClick={this.editRoleStatus.bind(this, data.id, '1') } >禁用角色</Button>
                                }
                            </span>
                        )
                    }
                }
            ]
        }
    }

    editRoleStatus(id, status) {
        changeStatus({id: id, status: status}).then(() => {
            Message({ showClose: true, message: '恭喜您，操作成功！', type: 'success' });
            this.setState({ loading : true, row: {dialogVisible: false} });
            this.props.requestRoleData("roleList").then(() => {
                this.setState({ loading : false });
            });
        }).catch(e => {
            console.log(e)
            Message({ showClose: true, message: e.errorCode + " : " + e.errorMsg, type: 'error'  });
        })
    }

    componentDidMount(){
        this.setState({ loading : true });
        this.props.requestRoleData("roleList").then(() => {
            this.setState({ loading : false });
        });
        //查询菜单
        fetchMenuList().then((result) => {
            this.setState({ menuList: result })
        }).catch((e) => {
            this.setState({ menuList: [] })
            console.log(e)
        });
    }

    // child component callback change state. and close Dialog
    callback(){
        this.setState({ loading : true, row: {dialogVisible: false} });
        this.props.requestRoleData("roleList").then(() => {
            this.setState({ loading : false});
        });
    }

    render(){
        return(
            <div>
                <Loading text="拼命加载中..." loading = {this.state.loading}>
                    <div className={"body-child"}>
                        <Button type="success" icon="plus" onClick={ () => this.setState({row: {dialogVisible: true, form: {}} }) }>添加角色</Button>
                        { <Add callback = {this.callback.bind(this)} menuList={this.state.menuList} row={this.state.row} />  }
                    </div>
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.props.roleData.roleList}
                        border={true}
                    />
                </Loading>
            </div>
        )
    }
}

export default connect(state => ({
    roleData: state.roleData,
}), {
    requestRoleData
})(Index);