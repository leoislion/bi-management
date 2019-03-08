<template>
  <div>

    <!--<div @click="jquerytest" id="test">change</div>-->
   <div style="width: 300px">
    <Tree :data="data5" :render="renderContent"></Tree>
   </div>
    <Modal
      v-model="modal6"
      title="新增菜单"
      :loading="loading"
      @on-ok="asyncOK" width="320">
      <p style="margin: 20px;margin-left: 50px">菜单名称</p>
      <Input v-model="value1" placeholder="" style="width: 200px;margin-left: 50px" />
      <br>
      <p style="margin: 20px;margin-left: 50px">英文标识</p>
      <Input v-model="value2" placeholder="" style="width: 200px;margin-left: 50px"/>
    </Modal>

  </div>


</template>
<script>
  import _global from '../../../global/Global'
  export default {
    name: "menu",
    data () {
      return {
        menuList:[],
        data1:[],
        data5: [
        ],
        buttonProps: {
          type: 'default',
          size: 'small',
        },
        modal6: false,
        loading: true,
        value1:"",
        value2:"",
        parent:Object,
        selectedData:Object,
        selectedRoot:Object,
        selectedNode:Object
      }
    },
    mounted(){
      this.getMenuTree();
    },
    methods: {
      jquerytest(){
        $("#test").html("ssss")
      },
      asyncOK () {
        setTimeout(() => {
          if(this.value1===""){
            this.$Message.warning("请输入菜单名称");
            return;
          }
          if(this.value2===""){
            this.$Message.warning("请输入英文标识");
            return;
          }
          let params={
            "parentName":this.parent.title,
            "menuName":this.value1,
            "menuEnname":this.value2
          }
          this.$http.post(_global.serverUrl+"/menu/addMenu",params).then(data=>{
              if(data.status===200){
                if(data.data.status===0) {
                  this.getMenuTree();
                  this.modal6 = false;
                }else {
                  this.$Message.error(data.data.msg);
                  this.modal6=false;
                }
              }else {

              }
          })

        }, 2000);
      },
      getMenuTree(){
        this.$http.get(_global.serverUrl+"/menu/getMenuTree").then(data=>{
          this.data5=data.data.data;
          this.data1=data.data.data;
        })
      },
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => { this.append(data) }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove'
              }),
              on: {
                click: () => { this.remove(root, node, data) }
              }
            })
          ])
        ]);
      },
      append (data) {
        this.modal6=true;
        this.parent=data;
      },
      remove (root, node, data) {
        if(data.children.length!=0){
          this.$Message.warning("该菜单有子菜单，不能删除！")
          return
        }
         this.confirm(root, node, data);
      },
      confirm (root, node, data) {
        this.$Modal.confirm({
          title: '删除菜单',
          content: '<p>确认删除？</p>',
          onOk: () => {
            const parentKey = root.find(el => el === node).parent;
            if(typeof (parentKey)!="undefined") {
              const parent = root.find(el => el.nodeKey === parentKey).node;
              let params={
                "menuName":data.title
              }
              let jsonStr =  JSON.stringify(params);
              const index = parent.children.indexOf(data);
              this.$http.delete(_global.serverUrl+"/menu/deleteMenu/"+data.title).then(data=>{
                this.$Message.success("删除成功")
                parent.children.splice(index, 1);
              })
            }else {
              this.$Message.warning("顶级菜单不能删除")
            }
          },
          onCancel: () => {

          }
        });
      },
    }
  }
</script>
