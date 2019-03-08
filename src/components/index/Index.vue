<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{

    margin: 0 auto;
    margin-left: 250px;
  }
  .layout-footer-center{
    text-align: center;
  }
  .head{
    float: right;
    margin-right: 20px;
    color:white;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1" v-if="systemSetting">
              <Icon type="ios-navigate"></Icon>
              系统设置
            </MenuItem>
            <MenuItem name="2" >
              <Icon type="ios-keypad"></Icon>
              Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>
              Item 3
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>
              Item 4
            </MenuItem>
          </div>
          <div class="head">

          <Avatar icon="ios-person" />
            <Poptip
              confirm
              @on-ok="ok"
              @on-cancel="cancel">
              <Button>注销</Button>
            </Poptip>
          </div>
        </Menu>
      </Header>
      <layout >
        <content style="min-height: 540px">
      <router-view />
        </content>
      </layout>
      <Footer class="layout-footer-center">@2019 &copy; 版权所有 软通动力信息技术（集团）有限公司</Footer>
    </Layout>
  </div>

</template>

<script>
  import _global from '../../global/Global'
  export default {
    name: "index",
    data(){
      return{
        systemSetting:_global.hasPermission("system_setting"),
      }},
    methods: {
      ok () {
        const param={
          userName:localStorage.getItem("userName"),
          userId:localStorage.getItem("userId")
        }
        this.$http.post(_global.serverUrl+"/user/logout",param).then(data=>{
          this.$router.push({
            path:"/"
          })
        })

      },
      cancel () {
        //this.$Message.info('You click cancel');
      }
    }
  }
</script>
