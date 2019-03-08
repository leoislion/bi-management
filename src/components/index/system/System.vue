<template>
  <Layout>
    <Sider hide-trigger :style="{background: '#fff'}">
      <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
        <Submenu name="1" v-if="sysSetting">
          <template slot="title" >
            <Icon type="ios-navigate"></Icon>
            系统管理
          </template>
          <router-link to="role"> <MenuItem name="1-1" v-if="roleManagement">角色管理</MenuItem></router-link>
          <router-link to="permittion"><MenuItem name="1-2" v-if="permissonManagement">权限管理</MenuItem></router-link>
          <router-link to="user"><MenuItem name="1-3" v-if="userManagement">用户管理</MenuItem></router-link>
          <router-link to="menuList"><MenuItem name="1-4" v-if="menuMangement">菜单管理</MenuItem></router-link>
        </Submenu>
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            Item 2
          </template>
          <MenuItem name="2-1">Option 1</MenuItem>
          <MenuItem name="2-2">Option 2</MenuItem>
        </Submenu>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-analytics"></Icon>
            Item 3
          </template>
          <MenuItem name="3-1">Option 1</MenuItem>
          <MenuItem name="3-2">Option 2</MenuItem>
        </Submenu>
      </Menu>
    </Sider>
    <Content :style="{padding: '24px', minHeight: ' 540px', background: '#fff',width:'100%',border:'20px solid #f5f7f9'}">
     <router-view/>
    </Content>
  </Layout>
</template>

<script>
  import _global from '../../../global/Global'
  export default {
    name: "system",
    data(){
      return{
        permissonManagement:_global.hasPermission('per_management'),
        roleManagement:_global.hasPermission("role_management"),
        userManagement:_global.hasPermission("user_management"),
        menuMangement:_global.hasPermission("menu_management"),
        sysSetting:_global.hasPermission("sys_management"),

      }
    }
  }
</script>
