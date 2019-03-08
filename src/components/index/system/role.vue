<template>
  <div>
    角色名称：<Input placeholder="请输入角色名称" style="width: 130px" v-model="roleName"/>
    <Button type="primary" icon="ios-search" style="margin-left: 15px" @click="roleSearch">搜索</Button>
    <Button type="success" icon="ios-refresh" style="margin-left: 15px" @click="refresh">刷新</Button>
    <div style="margin-top: 30px">
      <Button type="success" style="margin-top: 30px" @click="addDialog">新增角色</Button>
      <Modal v-model="addModal" title="新增角色" @on-ok="addRole" @on-cancel="cancel">
        <p>角色：<Input placeholder="请输入角色名称" style="margin-left:20px;margin-top:10px;width: 130px" v-model="roleName" /></p>
      </Modal>
      <Button type="error" style="margin-top: 30px;margin-left: 10px" @click="removeAllDialog">批量删除</Button>
      <Modal v-model="deleteAllModel" title="全部删除" @on-ok="removeAll" @on-cancel="cancel">
        <p>是否全部删除？</p>
      </Modal>
      <div style="margin-top: 10px">
        <Table border ref="selection":columns="columns" :data="datas" @on-selection-change="changeChose">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
            <Modal v-model="editModal" title="角色信息" @on-ok="update" @on-cancel="cancel">
              <p>角色：<Input  style="margin-left:20px;margin-top:10px;width: 130px" v-model="roleName" /></p>
            </Modal>
            <Button type="error" size="small" @click="deleteDialog(index)">删除</Button>
            <Modal v-model="deleteModel" title="删除" @on-ok="remove" @on-cancel="cancel">
              <p>是否删除？</p>
            </Modal>
          </template>
        </Table>
        <div style="text-align: right;margin-top: 10px">
          <Page :total=this.dataCount :current=this.pageCurrent :page-size=this.pageSize show-total  class="page" @on-change="changePage"  show-elevator />
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
        deleteModel:false,
        deleteAllModel:false,
        addModal:false,
        editModal:false,
        modal: false,
        roleId: 0,
        showId: 0,
        roleName:"",
        roleIdValue:0,
        pageCurrent:1,
        pageSize:5,
        dataCount:0,
        pageList:0,
        datas: [],
        totalDatas: [],
        containers: [],
        checkboxValues: [],
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
            title: '角色',
            key: 'roleName'
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
      this.roleSearchAll();
      this.changePage();
    },
    methods: {
      test(){
        this.$http.get(_global.feignServerUrl+"/feign/test").then(data=>{
          console.log(data);
        })
      },
      edit (index) {
        this.editModal= true;
        this.roleIdValue=this.datas[index].roleId;
        this.roleName=this.datas[index].roleName;
      },
      deleteDialog(index){
        this.deleteModel=true;
        console.log("datas==>"+JSON.stringify(this.datas));
        // this.datas.splice(index, 1);
        // console.log("this.roleId==>"+this.roleId);
        this.roleId=this.datas[index].roleId;
      },
      remove () {
        console.log("this.roleId==》"+this.roleId)
        this.$http.delete(_global.serverUrl+"/role/deleteById/"+ this.roleId).then(data=>{
          if (data.data.status === 0){
            this.$Message.success(data.data.data);
          }else{
            this.$Message.error(data.data.msg);
          }
          this.roleSearchAll();
        })
      },
      addDialog(){
        this.addModal=true;
        this.roleName="";
      },
      addRole () {
        if(this.roleName ==="" || this.roleName === null){
          this.$Message.info('角色名称和编号不能为空!');
        }else{
          let params ={
            "roleName":this.roleName
          }
          this.$http.post(_global.serverUrl+"/role/addRole",params).then(data=>{
            if (data.data.status === 0){
              this.$Message.success('成功');
            }else{
              this.$Message.error('失败');
            }
            this.roleName="";
            this.roleSearchAll();
          })
        }
      },
      update(){
        let params={
          "roleId":this.roleIdValue,
          "roleName":this.roleName
        }
        this.$http.put(_global.serverUrl+"/role/update/",params).then(data=>{
          if (data.data.status === 0){
            this.$Message.success('更新成功');
          }else{
            this.$Message.error('更新失败');
          }
          this.roleSearchAll();
        })
        this.modal=false;
      },
      cancel () {
        this.$Message.info('取消');
      },
      refresh(){
        this.roleSearchAll();
      },
      roleSearch(){
        let param={};
        if(this.roleName === null || this.roleName === ""){
          this.$Message.warning("角色名称不能为空！");
        }else{
          param.roleName=this.roleName
          this.$http.get(_global.serverUrl+"/role/queryRole/"+this.roleName).then(data=>{
            this.datas=[]
            console.log(data)
            for (let index in data.data.data) {
              console.log(data.data.data[index].roleName)
              this.datas.push({
                showId:parseInt(index)+1,
                roleId:data.data.data[index].roleId,
                roleName:data.data.data[index].roleName,
              });
            }
          })}
      },
      roleSearchAll(){
        this.$http.get(_global.serverUrl+"/role/queryRoleAll").then(data=>{
          this.datas=[];
          this.totalDatas=[];
          this.containers = [];
          this.dataCount=data.data.length
          this.pageList= Math.ceil(this.dataCount/this.pageSize)
          if(data.status === 200){
            for(let index in data.data){
              // console.log("===>"+typeof(index))
              let item = data.data[index]
              this.containers = ({
                showId:parseInt(index)+1,
                roleId:item.roleId,
                roleName:item.roleName,
              })
              this.totalDatas.push(this.containers)
            }
            if(this.dataCount<this.pageSize){
              this.datas=this.totalDatas;
            }else{
              this.datas=this.totalDatas.slice(0,this.pageSize);
            }
          }
          this.pageCurrent=1;
          this.roleName="";
        })
      },
      //点击，切换页面
      changePage(index){
        this.pageCurrent = index;
        let startIndex = (index -1)*this.pageSize;
        let endIndex = index*this.pageSize;
        this.datas.length=this.totalDatas.length;
        this.datas = this.totalDatas.slice(startIndex,endIndex);
      },
      removeAllDialog(){
        this.deleteAllModel=true;
      },
      removeAll(){
        console.log("removeAllParams=" + JSON.stringify(this.checkboxValues))
        if (this.checkboxValues.length>1) {
          this.$http.post(_global.serverUrl+"/role/deleteAll/",this.checkboxValues).then(data=>{
            if (data.data.status === 0){
              this.$Message.success(data.data.data);
            }else{
              this.$Message.error(data.data.data);
            }
            this.roleSearchAll();
            this.checkboxValues=[];
          })
        }else{
          this.$Message.error("请选择2个以上要删除的选项!");
        }
      },
      changeChose(data){
        console.log("changeChose(data)->"+JSON.stringify(data))
        console.log("changeChose(data)->"+JSON.stringify(this.checkboxValues))
        for (let index in data) {
          let roleId = data[index].roleId;
          let roleName = data[index].roleName;
          this.checkboxValues.push({"roleId":roleId,"roleName":roleName})
        }
        console.log("changeChose(data)->"+this.checkboxValues.length)
      }
    }
  }
</script>
