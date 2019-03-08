<template>
  <div>
    用户名：<Input placeholder="请输入用户名" style="width: 130px" v-model="userName" />
    <Button type="primary" icon="ios-search" style="margin-left: 15px" @click="userSearch" >搜索</Button>
    <Button type="success" icon="ios-refresh" style="margin-left: 15px" @click="refresh">刷新</Button>
    <div style="margin-top: 30px">
      <Button icon="ios-add" type="success" style="margin-top: 30px" @click="addDialog">新增用户</Button>
      <Modal v-model="addModal" title="新增用户" @on-ok="addUser" @on-cancel="cancel">
        <p>用户名：<Input placeholder="请输入用户名" style="margin-left:20px;margin-top:10px;width: 130px" v-model="userName" /></p>
        <p>角色：
          <Select v-model="roleName" style="margin-left:28px;margin-top:10px;width: 130px">
            <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
        </p>
        <p>真实姓名：<Input placeholder="请输入真实姓名" style="margin-left:5px;margin-top:10px;width: 130px" v-model="userAccount" /></p>
        <p>密码：<Input placeholder="请输入密码" style="margin-left:30px;margin-top:10px;width: 130px" v-model="userPassword" /></p>
        <p>电话号码：<Input placeholder="请输入电话号码" style="margin-left:5px;margin-top:10px;width: 130px" v-model="telphone" /></p>
      </Modal>
      <Button icon="ios-trash" type="error" style="margin-top: 30px;margin-left: 10px" @click="deleteAllDialog">批量删除</Button>
      <Modal v-model="deleteAllModel" title="全部删除" @on-ok="deleteAllByUserIds" @on-cancel="cancleDeleteAll">
        <p>是否全部删除？</p>
      </Modal>
      <div style="margin-top: 10px">
        <Table border ref="selection":columns="columns" :data="datas" @on-selection-change="changeChose">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="eidtDialog(index)">编辑</Button>
            <Modal v-model="editModal" title="用户信息" @on-ok="editUser" @on-cancel="cancel">
              <p>编号：<Input disabled style="margin-left:30px;margin-top:10px;width: 130px" v-model="userId" /></p>
              <p>用户名：<Input  disabled style="margin-left:18px;margin-top:10px;width: 130px" v-model="userName" /></p>
              <p>角色：
                <Select  style="margin-left:25px;margin-top:10px;width: 130px" v-model="roleName">
                  <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.value }}</Option>
                </Select>
              </p>
              <p>真实姓名：<Input  style="margin-left:5px;margin-top:10px;width: 130px" v-model="userAccount" /></p>
              <p>电话号码：<Input  style="margin-left:5px;margin-top:10px;width: 130px" v-model="telphone" /></p>
              <p>密码：    <Input  style="margin-left:25px;margin-top:10px;width: 130px" type="password" v-model="passwordKey" /></p>
            </Modal>
            <Button type="error" size="small" @click="deleteDialog(index)">删除</Button>
            <Modal v-model="deleteModal" title="删除" @on-ok="deleteByUserId" @on-cancel="cancel">
              <p>是否删除？</p>
            </Modal>
          </template>
        </Table>
        <div style="text-align: right;margin-top: 10px">
            <Page :total= this.dataCount :current=this.pageCurrent :page-size=this.pageSize show-total  class="page" @on-change="changePage"  show-elevator/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _global from '../../../global/Global'
  export default {
    data () {
      return {
        reload:true,
        editModal:false,
        addModal:false,
        deleteModal:false,
        deleteAllModel:false,
        middleRoleName :"",
        middleUserName :"",
        middleUserId :0,
        middleRoleId :0,
        userAccount:"",
        passwordKey:"",
        userPassword:"",
        pageSize:5,
        pageList:0,
        showId:0,
        dataCount:0,
        pageCurrent:1,
        datas: [],
        totalDatas: [],
        checkboxValues: [],
        roleNamesArr: [],
        middleDeleteDataArr: [],
        middleRoleIds: [],
        middleUserIds: [],
        roleNames: [],
        userId:0,
        userName:"",
        roleValue:"",
        roleName:"",
        realName:"",
        telphone:"",
        passwordValue:"",
        roleList:[],
        noShowPassword:"",
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '编号',
            key: 'showId'
          },
          {
            title: '用户名',
            key: 'userName'
          },
          {
            title: '角色',
            key: 'role'
          },
          {
            title: '姓名',
            key: 'realName'
          },
          {
            title: '电话',
            key: 'telphone'
          },
          {
            title: '密码',
            key: 'noShowPassword'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
      }
    },
    mounted(){
      this.test();
      this.userSearchAll();
      this.queryRoleAll();
      this.changePage();
    },
    methods: {
      test(){
        this.$http.get(_global.feignServerUrl+"/feign/test").then(data=>{
        })
      },
      userSearch(){
        let param={};
        if(this.userName === null || this.userName === ""){
          this.$Message.warning("查询用户不能为空！");
        }else{
          param.userName=this.userName
          this.$http.get(_global.serverUrl+"/user/queryUser/"+this.userName).then(data=>{
            this.datas=[]
            if(data.data.status === 0){
              for (let index in data.data.data){
                this.datas.push({
                  showId:parseInt(index)+1,
                  userId:data.data.data[index].userId,
                  userName:data.data.data[index].userName,
                  role:data.data.data[index].userRoleNames,
                  realName:data.data.data[index].userAccount,
                  telphone:data.data.data[index].telphone,
                  passwordKey:data.data.data[index].userPassword,
                  noShowPassword:"******"
                });
              }
            }
          })
        }
      },
      userSearchAll(){
        this.$http.get(_global.serverUrl+"/user/queryUserAll").then(data=>{
          this.datas=[];
          this.totalDatas=[];
          let object = [];
          this.dataCount=data.data.length
          this.pageList= Math.ceil(this.dataCount/this.pageSize)
          if(data.status === 200){
            for(let index in data.data){
              object = ({
                showId:parseInt(index)+1,
                userId:data.data[index].userId,
                userName:data.data[index].userName,
                role:data.data[index].userRoleNames,
                realName:data.data[index].userAccount,
                telphone:data.data[index].telphone,
                passwordKey:data.data[index].userPassword,
                noShowPassword:"******"
              })
              this.totalDatas.push(object);
            }
            // console.log("this.totalDatas.length=>"+this.totalDatas.length)
            if(this.dataCount<this.pageSize){
              this.datas=this.totalDatas;
            }else{
              this.datas=this.totalDatas.slice(0,this.pageSize);
            }
          }
        })
        this.pageCurrent=1;
        this.userName="";
      },
      addDialog(){
        this.addModal=true;
        this.userName="";
        this.roleName=""
        this.userAccount="";
        this.userPassword="";
        this.telphone="";
      },
      addUser () {
        if(this.userPassword.length>5){
          if(this.userName === null || this.userName === ""){
            this.$Message.info('添加用户名不能为空');
          }else{
            let params ={
              "userName":this.userName,
              "userRoleNames":this.roleName,
              "userAccount":this.userAccount,
              "userPassword":this.userPassword,
              "telphone":this.telphone
            }
            this.middleRoleName=this.roleName;
            this.middleUserName=this.userName;
            this.$http.post(_global.serverUrl+"/user/addUser",params).then(data=>{
              if (data.data.status === 0){
                this.$Message.success('添加成功');
              }else{
                this.$Message.error('添加失败');
              }
              this.userSearchAll();
              this.addUserRoleRelation();
            })
          }
        }else{
          this.$Message.warning('密码不能少于6位');
        }
      },
      eidtDialog(index){
        this.editModal= true;
        console.log("this.datas=>"+JSON.stringify(this.datas))
        this.userId=this.datas[index].userId;
        this.userName=this.datas[index].userName;
        this.userAccount=this.datas[index].realName;
        this.telphone=this.datas[index].telphone;
        this.roleName=this.datas[index].role;
        this.passwordKey=this.datas[index].passwordKey;
      },
      editUser(){
        // console.log(params)
        this.middleUserId=this.userId;
        this.middleRoleName=this.roleName;
        console.log(this.userPassword.length)
        if(this.passwordKey.length>5){
          let params ={
            "userId":this.userId,
            "userName":this.userName,
            "userRoleNames":this.roleName,
            "userAccount":this.userAccount,
            "userPassword":this.passwordKey,
            "telphone":this.telphone
          }
          this.$http.put(_global.serverUrl+"/user/update/",params).then(data=>{
            if (data.data.status === 0){
              this.$Message.success('编辑成功');
            }else{
              this.$Message.error('编辑失败');
            }
            this.userId="";
            this.userName="";
            this.roleValue="";
            this.userAccount="";
            this.telphone="";
            this.userSearchAll();
            this.updateUserRoleRelation();
          })
        }else{
          this.$Message.warning('密码不能少于6位');
        }
      },
      deleteDialog(index){
        this.deleteModal = true
        // console.log("this.datas=>"+JSON.stringify(this.datas))
        this.userId=this.datas[index].userId;
        this.middleUserId=this.userId;
        this.middleRoleName=this.datas[index].role;
      },
      deleteByUserId () {
        // console.log("deleteByParamUserId=>"+this.userId)
        this.$http.delete(_global.serverUrl+"/user/deleteByUserId/"+ this.userId).then(data=>{
          if (data.data.status === 0){
            this.$Message.success(data.data.data);
          }else{
            this.$Message.error(data.data.data);
          }
          this.deleteUserRoleRelation();
          this.userSearchAll();
        })
      },
      deleteAllDialog(){
        this.deleteAllModel=true;
        //通过roleName获取roleIds
        let params={};
        this.middleRoleIds=[];
        params.roleNames=this.roleNames;
        // console.log("queryRoleIds(params)==>"+JSON.stringify(params));
        if(params.length !== 0){
          this.$http.post(_global.serverUrl+"/role/queryRoleIds",params).then(data=>{
            // console.log("resp=>queryRoleIds(data)==>"+JSON.stringify(data));
            for(let index in data.data.data) {
              this.middleRoleIds.push(data.data.data[index].roleId)
            }
            console.log("resp》this.middleRoleIds==》"+JSON.stringify(this.middleRoleIds))
          })
        }else{
          console.log("queryRoleIds(params)参数异常")
        }
      },
      deleteAllByUserIds(){
        // console.log("removeAllParams=" + JSON.stringify(this.checkboxValues))
        // console.log(this.checkboxValues.length)
        this.middleDeleteDataArr=this.checkboxValues;
        if (this.checkboxValues.length>0) {
          this.$http.post(_global.serverUrl+"/user/deleteAllByUserIds",this.checkboxValues).then(data=>{
            if (data.data.status === 0){
              this.$Message.success(data.data.data);
            }else{
              this.$Message.error(data.data.data);
            }
            this.deleteAllUserRoleRelation();
            this.userSearchAll();
            this.checkboxValues=[];
          })
        }else{
          console.log("deleteAllByUserIds接口调用异常");
        }
      },
      queryRoleAll(){
        this.$http.get(_global.serverUrl+"/role/queryRoleAll").then(data=>{
          this.containers=[];
          // this.roleList=[];
         // console.log(data);
          if(data.status === 200){
            for(let index in data.data){
              let item = data.data[index];
              // console.log(item);
              this.containers = ({
                value: item.roleName,
                label: item.roleName
              })
              this.roleList.push(this.containers)
              // console.log("this.roleList=>"+JSON.stringify(this.roleList));
              // console.log("this.roleList.length=>"+this.roleList.length);
            }
          }
        })
      },
      addUserRoleRelation(){
        console.log("this.middleRoleName==>"+this.middleRoleName)
        console.log("this.middleUserName==>"+this.middleUserName)
        this.$http.get(_global.serverUrl+"/role/queryRole/"+this.middleRoleName).then(data=>{
          // console.log("data==>"+JSON.stringify(data))
          // console.log("this.middleRoleId==>"+data.data.data[0].roleId)
          this.middleRoleId=data.data.data[0].roleId;
          this.$http.get(_global.serverUrl+"/user/queryUser/"+ this.middleUserName).then(data=>{
            console.log("data.data.userId==>"+data.data.data[0].userId)
            this.middleUserId=data.data.data[0].userId;
            let params={
              "userId":this.middleUserId,
              "roleId":this.middleRoleId
            }
            if (this.middleUserId !== 0 && this.middleRoleId !== 0) {
              this.$http.post(_global.serverUrl+"/userRole/addUserRole",params).then(data=>{
                console.log(JSON.stringify(data));
              })
            }else{
              console.log("this.middleRoleId===0 || this.middleUserId === 0");
            }
          })
        })
      },
      updateUserRoleRelation(){
        // console.log("updateUserRoleRelation/middleRoleName=>"+this.middleRoleName)
        this.$http.get(_global.serverUrl+"/role/queryRole/"+this.middleRoleName).then(data=>{
          console.log("queryRole/middleRoleId==>"+JSON.stringify(data))
          this.middleRoleId=data.data.data[0].roleId;
          let params = {
            "userId":this.middleUserId,
            "roleId":this.middleRoleId
          }
          // console.log("updateUserRoleRelation/middleUserId=>"+this.middleUserId)
          // console.log("updateUserRoleRelation/middleRoleId=>"+this.middleRoleId)
          if (this.middleUserId !== 0 && this.middleRoleId !== 0){
            this.$http.post(_global.serverUrl+"/userRole/updateUserRole",params).then(data=>{
              console.log("updateUserRole=>"+JSON.stringify(data))
            })
          }else{
            console.log("userRoleRelation更新失败")
          }
        })
      },
      deleteUserRoleRelation(){
        console.log(this.middleUserId);
        console.log(this.middleRoleName);
        this.$http.get(_global.serverUrl+"/role/queryRole/"+this.middleRoleName).then(data=>{
          console.log("queryRole/middleRoleId==>"+JSON.stringify(data))
          this.middleRoleId=data.data.data[0].roleId;
          let params = {
            "userId":this.middleUserId,
            "roleId":this.middleRoleId
          }
          console.log("updateUserRoleRelation/middleUserId=>"+this.middleUserId)
          console.log("updateUserRoleRelation/middleRoleId=>"+this.middleRoleId)
          if (this.middleUserId !== 0 && this.middleRoleId !== 0){
            this.$http.post(_global.serverUrl+"/userRole/deleteByUserRoleId",params).then(data=>{
              console.log("updateUserRole=>"+JSON.stringify(data))
            })
          }else{
            console.log("userRoleRelation删除失败")
          }
        })
      },
      changeChose(datas){
        // console.log("changeChose==>"+JSON.stringify(datas))
        // console.log("changeChose.length==>"+JSON.stringify(datas.length))
        this.checkboxValues=[];
        this.roleNames=[];
        this.middleUserIds=[];
        for (let index in datas) {
          let userId = datas[index].userId;
          let userName = datas[index].userName;
          let realName = datas[index].realName;
          let role = datas[index].role;
          this.checkboxValues.push({"userId":userId,"userName":userName,"userRoleNames":role,"userAccount":realName})
          this.roleNames.push(role)
          this.middleUserIds.push(userId)
        }
        // console.log("checkboxValues==>"+JSON.stringify(this.checkboxValues))
        // console.log("checkboxValues.length==>"+this.checkboxValues.length)
        // console.log("roleNames==>"+JSON.stringify(this.roleNames))
        // console.log("roleNames.length==>"+ this.roleNames.length)
        // console.log("middleUserIds==>"+JSON.stringify(this.middleUserIds))
        // console.log("middleUserIds.length==>"+ this.middleUserIds.length)
      },
      deleteAllUserRoleRelation(){
        // console.log("this.checkboxValues(deleteAllUserRoleRelation)==>"+JSON.stringify(this.checkboxValues))
        // console.log("this.roleNamesArr(deleteAllUserRoleRelation)==>"+JSON.stringify(this.roleNamesArr))
        // console.log("this.middleDeleteDataArr(deleteAllUserRoleRelation)==>"+JSON.stringify(this.middleDeleteDataArr))
        let params = {};
        // let userIds = [];
        // for (let index in this.roleNamesArr){
        //   userIds.push(this.roleNamesArr[index].userId);
        // }
        params.userIds=this.middleUserIds;
        params.roleIds=this.middleRoleIds;
        // console.log("deleteAllByUserRoleIds(params)==>"+JSON.stringify(params));
        if(this.middleUserIds.length>0 && this.middleRoleIds.length>0){
          this.$http.post(_global.serverUrl+"/userRole/deleteAllByUserRoleIds",params).then(data=>{
            console.log("updateUserRole=>"+JSON.stringify(data))
          })
        }
        this.userSearchAll();
      },
      cancel () {
        this.userName="";
        this.userAccount="";
        this.userPassword="";
        this.telphone="";
        this.$Message.info('取消');
      },
      cancleDeleteAll(){
        this.checkboxValues=[];
      },
      refresh(){
        this.userSearchAll();
      },
      //点击，切换页面
      changePage(index){
        this.pageCurrent = index;
        let startIndex = (index -1)*this.pageSize;
        let endIndex = index*this.pageSize;
        this.datas = this.totalDatas.slice(startIndex,endIndex);
      },
    }
  }
</script>
