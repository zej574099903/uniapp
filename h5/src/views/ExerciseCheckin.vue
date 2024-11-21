<template>
  <div class="exercise-checkin">
    <van-nav-bar
      title="运动打卡"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="content">
      <!-- 已打卡提示 -->
      <div v-if="isCheckedIn" class="checked-in-tip">
        <van-cell-group inset>
          <van-cell>
            <template #title>
              <div class="tip-content">
                <van-icon name="success" color="#07c160" size="20" />
                <span class="tip-text">今日已完成打卡</span>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 日期选择 -->
      <div class="date-section">
        <van-cell-group inset>
          <van-cell title="运动日期" :value="currentDate" />
        </van-cell-group>
      </div>

      <!-- 运动时长 -->
      <div class="duration-section">
        <van-cell-group inset>
          <van-field
            v-model="duration"
            label="运动时长"
            type="digit"
            placeholder="请输入运动时长(分钟)"
            input-align="right"
            :readonly="isCheckedIn"
          >
            <template #button>
              <span class="unit">分钟</span>
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <!-- 运动类型 -->
      <div class="type-section">
        <van-cell-group inset>
          <van-field
            v-model="exerciseType"
            label="运动类型"
            placeholder="例如：跑步、健身、游泳等"
            :readonly="isCheckedIn"
          />
        </van-cell-group>
      </div>

      <!-- 运动强度 -->
      <div class="intensity-section">
        <van-cell-group inset>
          <van-field
            label="运动强度"
            :readonly="isCheckedIn"
          >
            <template #input>
              <van-rate 
                v-model="intensity" 
                :readonly="isCheckedIn"
                color="#ffd21e"
                void-icon="star"
                void-color="#eee"
              />
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <!-- 心得体会 -->
      <div class="reflection-section">
        <van-cell-group inset>
          <van-field
            v-model="reflection"
            label="心得体会"
            type="textarea"
            placeholder="记录运动过程中的感受、收获等"
            rows="3"
            autosize
            :readonly="isCheckedIn"
          />
        </van-cell-group>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section" v-if="!isCheckedIn">
        <van-button type="primary" block @click="handleSubmit">完成打卡</van-button>
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

// 获取当前日期
const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const currentDate = ref(getCurrentDate())
const duration = ref('')
const exerciseType = ref('')
const intensity = ref(3)
const reflection = ref('')

// 检查今日是否已打卡并加载数据
const checkTodayRecord = () => {
  try {
    const records = JSON.parse(localStorage.getItem('exerciseRecords') || '[]')
    const todayRecord = records.find(record => record.date === currentDate.value)
    
    if (todayRecord) {
      isCheckedIn.value = true
      duration.value = String(todayRecord.duration)
      exerciseType.value = todayRecord.type
      intensity.value = todayRecord.intensity
      reflection.value = todayRecord.reflection
    }
  } catch (error) {
    console.error('Error checking today record:', error)
  }
}

// 提交打卡
const handleSubmit = () => {
  if (!duration.value) {
    showToast('请输入运动时长')
    return
  }

  if (!exerciseType.value) {
    showToast('请输入运动类型')
    return
  }

  try {
    const record = {
      date: currentDate.value,
      duration: Number(duration.value),
      type: exerciseType.value,
      intensity: intensity.value,
      reflection: reflection.value
    }

    const records = JSON.parse(localStorage.getItem('exerciseRecords') || '[]')
    records.push(record)
    localStorage.setItem('exerciseRecords', JSON.stringify(records))

    showToast('打卡成功')
    router.back()
  } catch (error) {
    console.error('Error saving record:', error)
    showToast('保存失败，请重试')
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

onMounted(() => {
  checkTodayRecord()
})
</script>

<style scoped>
.exercise-checkin {
  padding-top: 46px;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content {
  padding: 16px;
}

.checked-in-tip {
  margin-bottom: 16px;
}

.tip-content {
  display: flex;
  align-items: center;
  color: #07c160;
}

.tip-text {
  margin-left: 8px;
}

.date-section,
.duration-section,
.type-section,
.intensity-section,
.reflection-section {
  margin-bottom: 16px;
}

.unit {
  color: #969799;
  font-size: 14px;
  padding: 0 8px;
}

.submit-section {
  margin-top: 24px;
}

:deep(.van-rate) {
  margin-top: 4px;
}
</style>
