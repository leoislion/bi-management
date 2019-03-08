<template>
  <div style="width: 800px">
    <div style="margin: 20px;font-size: 16px;color: red">权限分配</div>
    <Table border :columns="columns12" :data="data6">
      <template slot-scope="{ row }" slot="roleName">
        <strong>{{ row.roleName }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">分配权限</Button>
      </template>
    </Table>

    <!--<RadioGroup v-model="chosenOrder" @on-change="changeModel">-->
      <!--<Radio v-for="item in workOrderList" :label="item.label" :key="item.value"></Radio>-->
    <!--</RadioGroup>-->

    <Drawer title="权限分配" :closable="false" v-model="value1">
      <Tree :data="data2" show-checkbox multiple @on-check-change="changed" ref="tree"></Tree>
      <Button type="primary" size="small" style="margin: 20px" @click="save()">保存</Button>
    </Drawer>
   <!-- <div id="myChart" :style="{width: '300px', height: '300px'}"></div>-->
  </div>
</template>
<script>
  import _global from '../../../global/Global'
  export default {
    name: "permittion",
    data () {
      return {
        value1: false,
        columns12: [
          {
            title: '角色名称',
            slot: 'roleName'
          },
          {
            title: '操作',
            slot: 'action',
            width: 250,
            align: 'center'
          }
        ],
        data6: [
        ],
        data2: [
        ],
        roleId:0,
        checked:[],
        workOrderList:[
          {
            label:'保修',
            value:1
          },{
            label:'售后整机保修',
            value:2
          },{
            label:'软件维修',
            value:3
          },{
            label:'付费维修',
            value:4
          },
        ],
        chosenOrder:'付费维修',
      }
    },
    mounted(){
      this.getRoles();
      this.drawLine();

    },
    methods: {
      changeModel(){
        let test=this.chosenOrder;
      },
      show (row) {
        this.roleId=row.roleId;
        this.value1=true;
        this.checked=null;
        this.$http.get(_global.serverUrl+"/permission/getPermission/"+row.roleId).then(data=>{
          this.data2=data.data.data;
        })
      },
      remove (index) {
        this.data6.splice(index, 1);
      },
      getRoles(){
        this.$http.get(_global.serverUrl+"/role/queryRoleAll").then(data=>{
            let items=data.data;
            this.data6=items;
        })
      },
      save(){
        this.checked=this.$refs.tree.getCheckedAndIndeterminateNodes();
        let params={
          "roleId":this.roleId,
          "children":this.checked
        };
        this.$http.post(_global.serverUrl+"/permission/updatePermission",params).then(data=>{
          this.$Message.success("保存成功，重新登录即可生效")
          this.value1=false;
        });
      },
      changed(){
        let choicesAll=this.$refs.tree.getCheckedNodes(); //方法的运用 getSelectedNodes也是如此用法
        let checked=this.$refs.tree.getCheckedAndIndeterminateNodes();
        console.log(checked)
        this.checked=checked;
      },
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: { text: '在Vue中使用echarts' },
          tooltip: {},
          xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        });
      }
    }
  }
</script>
