<template>
    <div class="login-container">
      <div class="login-form-wrap">
        <div class="login-head">
          <h3>Service Account Sign In</h3>
        </div>
        <el-form class="login-form" ref="login-form" :model="user" :rules="formLoginRules">
          <el-form-item prop="account">
            <el-input v-model="user.account" prefix-icon='el-icon-user' clearable placeholder="请输入登录名"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="user.password" prefix-icon='el-icon-lock' clearable show-password
                      @keyup.enter.native="onLogin" placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>
  
<script>
  import { login } from '../../api'
  
  export default {
    name: 'LoginIndex',
    components: {},
    props: {},
    data () {
      return {
        loginLoading: false, // 登录的 loading 状态
        user: {
          account: 'sys_svc_uias', // 登录名
          password: '123456' // 密码
        },
        checked: true, // 是否同意协议的选中状态
        // 表单验证规则配置
        formLoginRules: {
          account: [
            {
              required: true,
              type: 'string',
              message: '请输入用户名',
              trigger: ['blur', 'change']
            }
          ],
          password: [
            {
              required: true,
              type: 'string',
              message: '请输入密码',
              trigger: ['blur', 'change']
            }
          ]
        }
      }
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    methods: {
        async loginRequest() {
            const data = {"uias": this.user}
            return await login(data)
      },
  
      onLogin () {
        /**
         * 表单验证， validate 方法是异步的
         * 获取表单数据（根据接口要求绑定数据）
         */
        this.$refs['login-form'].validate(valid => {
          // 如果表单验证失败，停止请求提交
          if (!valid) {
            return
          }
          // 验证通过，请求登录
          this.Login()
        })
      },
  
      Login: async function () {
        /**
         * 表单验证通过，提交登录
         */
        this.loginLoading = true
        await this.loginRequest().then(response => {
            window.localStorage.setItem('userInfo', JSON.stringify({ user: response.payload }))
            this.loginLoading = false
            this.$router.push({
                name: 'home' /* 这个 name 是路由的名字 */
            })
        }).catch(err => {
            this.loginLoading = false
            this.$notify({ duration: 2000, title: '登录失败', message: err, type: 'error' })
        })
        
        

      }
    }
  }
</script>
  
<style scoped lang="less">
    .login-container {
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(10px);
      text-align: center;
      position: absolute;
        
      .login-form-wrap {
        min-width: 300px;
        padding: 30px 50px 10px;
        background-color: #F2F2F7;
  
        .login-head {
          display: flex;
          justify-content: center;
          h3 {
            color: #278df3;
          }
        }
  
        .login-form {
          .login-btn {
            width: 100%;
          }
        }
      }
    }
</style>
  