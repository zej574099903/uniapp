<template>
  <div class="checkin-container">
    <div class="header">
      <van-nav-bar
        title="今日打卡"
        left-arrow
        @click-left="router.back()"
      />
    </div>

    <div class="checkin-content">
      <!-- 打卡状态卡片 -->
      <div class="status-card">
        <div class="time">{{ currentTime }}</div>
        <div class="date">{{ currentDate }}</div>
        <div class="status" :class="{ checked: hasCheckedIn }">
          {{ hasCheckedIn ? '已打卡' : '未打卡' }}
        </div>
      </div>

      <!-- 打卡统计 -->
      <div class="stats-card">
        <div class="stat-item">
          <div class="value">{{ stats.continuous }}</div>
          <div class="label">连续打卡</div>
        </div>
        <div class="stat-item">
          <div class="value">{{ stats.monthly }}</div>
          <div class="label">本月打卡</div>
        </div>
        <div class="stat-item">
          <div class="value">{{ stats.total }}</div>
          <div class="label">总打卡天数</div>
        </div>
      </div>

      <!-- 打卡日历 -->
      <div class="calendar-card">
        <h3>打卡记录</h3>
        <van-calendar 
          :show-title="false"
          :poppable="false"
          :show-confirm="false"
          :style="{ height: '300px' }"
          :default-date="new Date()"
          :formatter="calendarFormatter"
        />
      </div>

      <!-- 打卡按钮 -->
      <div class="action-button">
        <van-button 
          round 
          block 
          type="primary" 
          :disabled="hasCheckedIn"
          @click="handleCheckin"
        >
          {{ hasCheckedIn ? '今日已打卡' : '立即打卡' }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'

const router = useRouter()
const currentTime = ref('')
const currentDate = ref('')
const hasCheckedIn = ref(false)
let timer = null

// 打卡统计数据
const stats = ref({
  continuous: 3,  // 连续打卡天数
  monthly: 15,    // 本月打卡天数
  total: 45       // 总打卡天数
})

// 更新时间
const updateTime = () => {
  const now = new Date()
  const formatNumber = (n) => n < 10 ? '0' + n : n
  
  currentTime.value = `${formatNumber(now.getHours())}:${formatNumber(now.getMinutes())}:${formatNumber(now.getSeconds())}`
  currentDate.value = `${now.getFullYear()}年${formatNumber(now.getMonth() + 1)}月${formatNumber(now.getDate())}日`
}

// 处理打卡
const handleCheckin = () => {
  hasCheckedIn.value = true
  stats.value.continuous++
  stats.value.monthly++
  stats.value.total++
  showSuccessToast('打卡成功')
  
  // 这里可以添加实际的打卡API调用
}

// 日历格式化
const calendarFormatter = (day) => {
  // 模拟一些历史打卡数据
  const checkedDays = [1, 2, 3, 5, 8, 9, 10, 12, 15]
  const isChecked = checkedDays.includes(day.date.getDate())
  
  return {
    ...day,
    className: isChecked ? 'checked-day' : '',
    text: day.text,
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">
.checkin-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.checkin-content {
  padding: 16px;
}

.status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  text-align: center;
  margin-bottom: 16px;

  .time {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .date {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 16px;
  }

  .status {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    font-size: 14px;

    &.checked {
      background: rgba(47, 255, 94, 0.2);
    }
  }
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .stat-item {
    text-align: center;

    .value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }

    .label {
      font-size: 12px;
      color: #999;
    }
  }
}

.calendar-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #333;
  }

  :deep(.checked-day) {
    .van-calendar-day {
      background: #667eea;
      color: white;
      border-radius: 4px;
    }
  }
}

.action-button {
  margin-top: 24px;
  padding: 0 16px;

  :deep(.van-button--primary) {
    background: linear-gradient(to right, #667eea, #764ba2);
    border: none;
    height: 44px;

    &.van-button--disabled {
      opacity: 0.6;
    }
  }
}
</style>
