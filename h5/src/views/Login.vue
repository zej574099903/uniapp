<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="../assets/logo.svg" alt="Logo" class="logo">
        <h2>欢迎登录</h2>
        <p class="subtitle">请使用您的账号密码登录系统</p>
      </div>
      
      <div class="login-form">
        <van-form @submit="onSubmit" class="form-content">
          <van-cell-group inset>
            <van-field
              v-model="username"
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              :rules="[{ required: true, message: '请输入用户名' }]"
              left-icon="user-o"
            />
            <van-field
              v-model="password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请输入密码' }]"
              left-icon="lock"
            />
          </van-cell-group>
          
          <div class="submit-btn">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              loading-text="登录中..."
            >
              登录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showFailToast } from 'vant'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)

const onSubmit = async (values) => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里替换为实际的登录API调用
    if (username.value === 'admin' && password.value === 'admin') {
      const fakeToken = 'fake-token-' + Date.now()
      const fakeUserInfo = {
        username: username.value,
        nickname: '管理员',
        avatar: ''
      }
      
      userStore.setToken(fakeToken)
      userStore.setUserInfo(fakeUserInfo)
      
      showToast('登录成功')
      router.push('/')
    } else {
      showFailToast('用户名或密码错误')
    }
  } catch (error) {
    showFailToast('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  padding-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.login-header h2 {
  font-size: 24px;
  color: #323233;
  margin: 0;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #969799;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.form-content {
  :deep(.van-cell-group--inset) {
    margin: 0;
  }
  
  :deep(.van-field__left-icon) {
    margin-right: 8px;
  }
}

.submit-btn {
  margin-top: 24px;
  padding: 0 16px;
}

:deep(.van-button--primary) {
  height: 44px;
  background: linear-gradient(to right, #667eea, #764ba2);
  border: none;
}
</style>
