<template>
  <div style="width: 100%;min-height: 650px;  display: table-cell;
    vertical-align: middle;
     " >
    <vue-particle-line>
      <div style="width: 1300px;min-height: 650px;text-align: center;margin-top: 20px">
        <span style="    font-size: 30px;
    margin-left: 100px;font-family: STKaiti;color: darkorange">商业智能后台管理系统</span>
      </div>
    </vue-particle-line>
    <div style=" position: absolute;
            width:250px;
            height: 250px;
            top:40%;
            left:45%;
            margin-left:-50px;
            margin-top:-25px;background: aliceblue;border-radius: 10px">

      <Form ref="formInline" :model="formInline" :rules="ruleInline" style="margin-top: 47px;
    width: 210px;
    margin-left: 17px;text-align: center">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
        </FormItem>
      </Form>

    </div>
    <!--<button @click="tet()">xxx</button>-->
  </div>
</template>
<script>
  import _global from '../../global/Global'
  export default {
    name: "login",
    data(){
      return{
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { type: 'string', min: 6, message: '密码不能小于6位', trigger: 'blur' }
          ]
        }
      }
    },
  mounted() {
    var orderHight = document.body.clientHeight
    document.getElementById('order-list').style.height = orderHight + 'px'
      },
    methods: {

      handleSubmit(name) {
        const that=this;
        this.$refs[name].validate((valid) => {
          if (valid) {

            const param={
              userName:this.formInline.user,
              userPassword:this.formInline.password
            }
            this.$http
              .post(_global.serverUrl+"/user/login", param)
              .then(data => {
                if(data.data.status==0) {
                  const result=data.data.data;
                  localStorage.setItem("userName",result.userName);
                  localStorage.setItem("userId",result.userId);
                  localStorage.setItem("token",result.token);
                  localStorage.setItem("permission",result.permission);
                  this.$router.push({
                    path:"/index"
                  })
                }else{
                  this.$Message.error('用户名或密码错误，登录失败');
                }

              });
            //this.$Message.success('Success!');
          } else {
            this.$Message.error('登录失败');
          }
        })
      },
      tet(){
        this.$http.get("http://localhost:8769/user-service/user/getName/leo").then(data=>{
          console.log(data);
        })
      }
    }
  }

</script>
