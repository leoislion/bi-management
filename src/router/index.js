import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/Login'
import Index from '@/components/index/Index'
import System from '@/components/index/system/System'
import Role from '@/components/index/system/role'
import Permittion from '@/components/index/system/Permittion'
import User from '@/components/index/system/User'
import MenuList from '@/components/index/system/MenuList'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      //一级路由
      path:'/index',
      name:'index',
      component: Index,
      children:[

        {
          path: "/index",
          redirect: "/index/system"
        },
        {
          path:"/index/system",
          name:'system',
          component: System,
          children:[
            {
              path:"/index/system",
              redirect:"/index/system/role"
            },
            {
              path:"/index/system/role",
              name:"role",
              component:Role
            },
            {
              path:"/index/system/permittion",
              name:"permittion",
              component:Permittion
            },
            {
              path:"/index/system/user",
              name:"user",
              component:User
            },
            {
              path:"/index/system/menuList",
              name:"menuList",
              component: MenuList
            }
          ]
        }
      ]
    }
  ]
})
