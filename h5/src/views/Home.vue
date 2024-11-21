<template>
  <div class="home">
    <van-nav-bar title="每日打卡" fixed />
    
    <div class="content">
      <!-- 顶部时间 -->
      <div class="header">
        <div class="time-display">
          <div class="time">{{ currentTime }}</div>
          <div class="date">{{ currentDate }}</div>
        </div>
        <van-icon name="setting-o" class="settings-icon" @click="handleLogout" />
      </div>

      <!-- 打卡项目 -->
      <div class="checkin-grid">
        <div
          v-for="item in checkinItems"
          :key="item.id"
          class="checkin-item"
          @click="handleCheckinClick(item.id)"
        >
          <div class="item-content">
            <div class="item-header">
              <van-icon :name="item.icon" :color="item.color" size="24" />
              <span class="item-title">{{ item.title }}</span>
            </div>
            <div class="progress-circle">
              <van-circle
                :rate="item.progress"
                :color="item.color"
                :speed="100"
                :stroke-width="6"
                size="70px"
                :layer-color="item.progress === 0 ? '#f5f5f5' : 'rgba(255, 255, 255, 0.35)'"
              >
                <template #default>
                  <span class="progress-text">
                    <span class="progress-value">{{ item.progress }}%</span>
                    <span class="progress-label">{{ item.progress === 100 ? '已完成' : '未完成' }}</span>
                  </span>
                </template>
              </van-circle>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 获取当前时间和日期
const getCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const getCurrentDate = () => {
  const now = new Date()
  return `${now.getMonth() + 1}月${now.getDate()}日`
}

const currentTime = ref(getCurrentTime())
const currentDate = ref(getCurrentDate())

// 打卡项目
const checkinItems = ref([
  {
    id: 'spiritual',
    title: '灵修打卡',
    icon: 'smile-o',
    color: '#1989fa',
    progress: 0
  },
  {
    id: 'piano',
    title: '练琴打卡',
    icon: 'music-o',
    color: '#ff976a',
    progress: 0
  },
  {
    id: 'bible',
    title: '今日读经',
    icon: 'book-o',
    color: '#07c160',
    progress: 0
  },
  {
    id: 'exercise',
    title: '跑步打卡',
    icon: 'guide-o',
    color: '#07c160',
    progress: 0
  }
])

// 处理打卡点击
const handleCheckinClick = (id) => {
  switch (id) {
    case 'spiritual':
      router.push('/checkin-detail')
      break
    case 'piano':
      router.push('/piano-checkin')
      break
    case 'bible':
      router.push('/bible-checkin')
      break
    case 'exercise':
      router.push('/running-checkin')
      break
  }
}

// 更新打卡进度
const updateProgress = () => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]

    // 更新灵修打卡进度
    const spiritualData = localStorage.getItem('spiritualCheckins')
    if (spiritualData) {
      const data = JSON.parse(spiritualData)
      const todayReading = data.bibleReadings?.[currentDate]
      checkinItems.value[0].progress = todayReading?.completed ? 100 : 0
    }

    // 更新练琴打卡进度
    const pianoRecords = JSON.parse(localStorage.getItem('pianoRecords') || '[]')
    const todayPiano = pianoRecords.find(record => record.date === currentDate)
    checkinItems.value[1].progress = todayPiano ? 100 : 0

    // 更新今日读经打卡进度
    const bibleRecords = JSON.parse(localStorage.getItem('bibleRecords') || '[]')
    const todayBible = bibleRecords.find(record => record.date === currentDate)
    checkinItems.value[2].progress = todayBible ? 100 : 0

    // 更新跑步打卡进度
    const runningRecords = JSON.parse(localStorage.getItem('runningRecords') || '[]')
    const todayRunning = runningRecords.find(record => record.date === currentDate)
    checkinItems.value[3].progress = todayRunning ? 100 : 0
  } catch (error) {
    console.error('Error updating progress:', error)
  }
}

// 更新时间
const updateTime = () => {
  currentTime.value = getCurrentTime()
  currentDate.value = getCurrentDate()
}

// 处理登出
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  updateProgress()
  updateTime()
  // 每分钟更新一次时间
  setInterval(updateTime, 60000)
})

// 每次组件激活时更新进度
onActivated(() => {
  updateProgress()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  padding: 46px 16px 16px;
  position: relative;
  overflow: hidden;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 添加动态背景图案 */
.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 30%);
  animation: patternMove 20s linear infinite;
  pointer-events: none;
}

@keyframes patternMove {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  transform: translateZ(0);
  transition: all 0.3s ease;
}

.header:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.time-display {
  text-align: left;
}

.time {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(120deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.date {
  font-size: 16px;
  opacity: 0.9;
  margin-top: 6px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.settings-icon {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.settings-icon:hover {
  transform: rotate(90deg);
  background: rgba(255, 255, 255, 0.2);
}

.settings-icon:active {
  transform: rotate(90deg) scale(0.95);
}

.checkin-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0;
}

.checkin-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transform: translateZ(0);
  position: relative;
  overflow: hidden;
}

.checkin-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(120deg, rgba(255,255,255,0.3), rgba(255,255,255,0));
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.checkin-item:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.checkin-item:hover::before {
  transform: translateX(100%);
}

.checkin-item:active {
  transform: translateY(-2px);
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.3px;
}

.progress-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.checkin-item:hover .progress-circle {
  transform: scale(1.15);
}

.progress-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}

.progress-value {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(120deg, #1a2a6c, #b21f1f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.progress-label {
  font-size: 13px;
  color: #666;
  margin-top: 3px;
  font-weight: 500;
}

:deep(.van-nav-bar) {
  background-color: transparent;
  --van-nav-bar-title-text-color: white;
}

:deep(.van-nav-bar__title) {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.van-circle) {
  --van-circle-text-color: #1a1a1a;
}

/* 添加响应式设计 */
@media (max-width: 360px) {
  .checkin-grid {
    gap: 16px;
  }
  
  .checkin-item {
    padding: 20px;
  }
  
  .time {
    font-size: 36px;
  }
  
  .date {
    font-size: 14px;
  }
  
  .item-title {
    font-size: 16px;
  }
}
</style>
