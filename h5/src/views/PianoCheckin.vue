<template>
  <div class="piano-checkin">
    <van-nav-bar
      title="练琴打卡"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="content">
      <!-- 日期选择 -->
      <div class="date-section section-card">
        <van-cell-group inset>
          <van-cell title="练琴日期" :value="currentDate" />
        </van-cell-group>
      </div>

      <!-- 练琴时长 -->
      <div class="duration-section section-card">
        <van-cell-group inset>
          <van-field
            v-model="duration"
            label="练琴时长"
            type="digit"
            placeholder="请输入练琴时长(分钟)"
            input-align="right"
          >
            <template #button>
              <span class="unit">分钟</span>
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <!-- 快速选择练琴时长 -->
      <div class="quick-duration-section section-card">
        <van-cell-group inset>
          <van-cell title="练琴时长">
            <template #value>
              <div class="quick-duration-buttons">
                <van-button 
                  v-for="time in quickDurations" 
                  :key="time"
                  :type="duration === time ? 'primary' : 'default'"
                  size="small"
                  @click="selectDuration(time)"
                  :disabled="isCheckedIn"
                >{{ time }}分钟</van-button>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 练习内容 -->
      <div class="content-section section-card">
        <van-cell-group inset>
          <van-cell title="练习内容">
            <template #value>
              <div class="quick-content-buttons">
                <van-tag 
                  v-for="item in practiceContents" 
                  :key="item"
                  :type="selectedContents.includes(item) ? 'primary' : 'default'"
                  size="medium"
                  @click="toggleContent(item)"
                  :disabled="isCheckedIn"
                  class="content-tag"
                >{{ item }}</van-tag>
              </div>
            </template>
          </van-cell>
          <van-field
            v-model="practiceContent"
            label="其他内容"
            type="textarea"
            placeholder="记录今天练习的曲目、技巧等"
            rows="3"
            autosize
          />
        </van-cell-group>
      </div>

      <!-- 心得体会 -->
      <div class="reflection-section section-card">
        <van-cell-group inset>
          <van-field
            v-model="reflection"
            label="心得体会"
            type="textarea"
            placeholder="记录练琴过程中的感悟、进步等"
            rows="3"
            autosize
          />
        </van-cell-group>
      </div>

      <!-- 心情 -->
      <div class="mood-section section-card">
        <van-cell-group inset>
          <van-cell title="练琴心情">
            <template #value>
              <div class="mood-selector" :class="{ 'disabled': isCheckedIn }">
                <div 
                  v-for="(item, index) in moods" 
                  :key="index"
                  class="mood-item"
                  :class="{ 'selected': mood === item.value }"
                  @click="!isCheckedIn && (mood = item.value)"
                >
                  {{ item.icon }}
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button type="primary" block @click="handleSubmit" :disabled="isCheckedIn">完成打卡</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const isCheckedIn = ref(false)
const currentDate = ref('')
const duration = ref('')
const practiceContent = ref('')
const selectedContents = ref([])
const reflection = ref('')
const mood = ref('')
const quality = ref(3)

// 预设选项
const quickDurations = ['15', '30', '45', '60', '90', '120']
const practiceContents = ['基础练习', '音阶练习', '练习曲', '新曲目', '复习曲目', '视奏练习']
const moods = [
  { value: 'happy', icon: '😊' },
  { value: 'satisfied', icon: '😌' },
  { value: 'neutral', icon: '😐' },
  { value: 'tired', icon: '😫' },
  { value: 'frustrated', icon: '😤' }
]

// 获取当前日期
const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 检查今日是否已打卡并加载数据
const checkTodayRecord = () => {
  try {
    currentDate.value = getCurrentDate()
    const records = JSON.parse(localStorage.getItem('pianoRecords') || '[]')
    const todayRecord = records.find(record => record.date === currentDate.value)
    
    if (todayRecord) {
      isCheckedIn.value = true
      duration.value = String(todayRecord.duration)
      practiceContent.value = todayRecord.content || ''
      selectedContents.value = todayRecord.selectedContents || []
      reflection.value = todayRecord.reflection || ''
      mood.value = todayRecord.mood || ''
      quality.value = todayRecord.quality || 3
    }
  } catch (error) {
    console.error('Error checking today record:', error)
  }
}

onMounted(() => {
  checkTodayRecord()
})

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 选择时长
const selectDuration = (time) => {
  duration.value = time
}

// 切换练习内容
const toggleContent = (item) => {
  if (!isCheckedIn.value) {
    const index = selectedContents.value.indexOf(item)
    if (index > -1) {
      selectedContents.value.splice(index, 1)
    } else {
      selectedContents.value.push(item)
    }
  }
}

// 提交打卡
const handleSubmit = () => {
  if (!duration.value) {
    showToast('请选择练琴时长')
    return
  }

  if (selectedContents.value.length === 0) {
    showToast('请选择练习内容')
    return
  }

  if (!mood.value) {
    showToast('请选择练琴心情')
    return
  }

  try {
    const record = {
      date: currentDate.value,
      duration: Number(duration.value),
      content: practiceContent.value,
      selectedContents: selectedContents.value,
      reflection: reflection.value,
      mood: mood.value,
      quality: quality.value
    }

    const records = JSON.parse(localStorage.getItem('pianoRecords') || '[]')
    records.push(record)
    localStorage.setItem('pianoRecords', JSON.stringify(records))

    showToast({
      type: 'success',
      message: '打卡成功',
      onClose: () => {
        router.back()
      }
    })
  } catch (error) {
    console.error('Error saving record:', error)
    showToast('保存失败，请重试')
  }
}
</script>

<style scoped>
.piano-checkin {
  min-height: 100vh;
  background: linear-gradient(45deg, #0f2027, #203a43, #2c5364);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  padding-top: 46px;
  position: relative;
  overflow-x: hidden;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.piano-checkin::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 25%);
  animation: patternMove 30s linear infinite;
  pointer-events: none;
}

@keyframes patternMove {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

.content {
  position: relative;
  z-index: 1;
  padding: 20px;
}

.section-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transform: translateZ(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.checked-in-tip {
  margin-bottom: 20px;
}

.tip-content {
  display: flex;
  align-items: center;
  color: #07c160;
  font-size: 16px;
  font-weight: 500;
  padding: 16px 20px;
  background: rgba(7, 193, 96, 0.1);
  border-radius: 16px;
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.tip-text {
  margin-left: 10px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, #0f2027, #2c5364);
  border-radius: 2px;
}

.quick-duration-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-duration-buttons .van-button {
  min-width: 80px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quick-duration-buttons .van-button--primary {
  background: linear-gradient(135deg, #0f2027, #2c5364);
  border: none;
  box-shadow: 0 4px 12px rgba(44, 83, 100, 0.2);
}

.quick-duration-buttons .van-button--primary:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(44, 83, 100, 0.15);
}

.quick-content-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: -4px;
}

.content-tag {
  margin: 4px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background: #f5f5f5;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.content-tag::before {
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

.content-tag:not([disabled]):active {
  transform: scale(0.95);
}

.content-tag.selected {
  background: linear-gradient(135deg, #0f2027, #2c5364);
  color: white;
  box-shadow: 0 4px 12px rgba(44, 83, 100, 0.2);
}

.content-tag:hover::before {
  transform: translateX(100%);
}

.mood-selector {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  padding: 10px 0;
}

.mood-item {
  font-size: 32px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: grayscale(1);
}

.mood-item:hover {
  transform: scale(1.1);
  opacity: 0.8;
  filter: grayscale(0.5);
}

.mood-item.selected {
  opacity: 1;
  transform: scale(1.2);
  filter: grayscale(0);
}

.disabled .mood-item {
  cursor: default;
  pointer-events: none;
}

:deep(.van-rate) {
  display: flex;
  justify-content: center;
  --van-rate-icon-size: 28px;
}

:deep(.van-rate__icon) {
  transition: all 0.3s ease;
}

:deep(.van-rate__icon--full) {
  transform: scale(1.1);
}

:deep(.van-field__control) {
  font-size: 15px;
  background-color: transparent;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.van-field__control:focus) {
  border-color: #2c5364;
  box-shadow: 0 0 0 3px rgba(44, 83, 100, 0.1);
}

.submit-section {
  margin-top: 30px;
  padding: 0 16px 20px;
}

:deep(.van-button--primary) {
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #0f2027, #2c5364);
  border: none;
  box-shadow: 0 4px 12px rgba(44, 83, 100, 0.2);
  transition: all 0.3s ease;
}

:deep(.van-button--primary:active) {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(44, 83, 100, 0.15);
}

:deep(.van-nav-bar) {
  background-color: transparent;
  --van-nav-bar-title-text-color: white;
  --van-nav-bar-icon-color: white;
}

:deep(.van-nav-bar__title) {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.van-nav-bar__arrow) {
  font-size: 20px;
}

@media (max-width: 360px) {
  .content {
    padding: 16px;
  }
  
  .section-card {
    padding: 20px;
  }
  
  .quick-duration-buttons .van-button {
    min-width: 70px;
  }
  
  .mood-item {
    font-size: 28px;
  }
}

/* 添加进入动画 */
.section-card {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-card:nth-child(2) { animation-delay: 0.1s; }
.section-card:nth-child(3) { animation-delay: 0.2s; }
.section-card:nth-child(4) { animation-delay: 0.3s; }
.section-card:nth-child(5) { animation-delay: 0.4s; }
</style>
