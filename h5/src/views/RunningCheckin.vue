<template>
  <div class="running-checkin">
    <van-nav-bar
      title="跑步打卡"
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
          <van-cell title="跑步日期" :value="currentDate" />
        </van-cell-group>
      </div>

      <!-- 跑步距离 -->
      <div class="distance-section">
        <van-cell-group inset>
          <van-field
            v-model="distance"
            label="跑步距离"
            type="digit"
            placeholder="请输入跑步距离(公里)"
            input-align="right"
            :readonly="isCheckedIn"
          >
            <template #button>
              <span class="unit">公里</span>
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <!-- 跑步时长 -->
      <div class="duration-section">
        <van-cell-group inset>
          <van-field
            v-model="duration"
            label="跑步时长"
            type="digit"
            placeholder="请输入跑步时长(分钟)"
            input-align="right"
            :readonly="isCheckedIn"
          >
            <template #button>
              <span class="unit">分钟</span>
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <!-- 配速计算 -->
      <div class="pace-section" v-if="showPace">
        <van-cell-group inset>
          <van-cell title="平均配速" :value="averagePace + ' 分钟/公里'" />
        </van-cell-group>
      </div>

      <!-- 跑步感受 -->
      <div class="feeling-section">
        <van-cell-group inset>
          <van-field
            label="体感强度"
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
            placeholder="记录跑步过程中的感受、收获等"
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
import { ref, computed, onMounted, watch } from 'vue'
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
const distance = ref('')
const duration = ref('')
const intensity = ref(3)
const reflection = ref('')

// 计算配速
const showPace = computed(() => {
  return distance.value && duration.value && 
         !isNaN(distance.value) && !isNaN(duration.value) &&
         parseFloat(distance.value) > 0
})

const averagePace = computed(() => {
  if (!showPace.value) return ''
  const pace = parseFloat(duration.value) / parseFloat(distance.value)
  return pace.toFixed(2)
})

// 检查今日是否已打卡并加载数据
const checkTodayRecord = () => {
  try {
    const records = JSON.parse(localStorage.getItem('runningRecords') || '[]')
    const todayRecord = records.find(record => record.date === currentDate.value)
    
    if (todayRecord) {
      isCheckedIn.value = true
      distance.value = String(todayRecord.distance)
      duration.value = String(todayRecord.duration)
      intensity.value = todayRecord.intensity
      reflection.value = todayRecord.reflection
    }
  } catch (error) {
    console.error('Error checking today record:', error)
  }
}

// 提交打卡
const handleSubmit = () => {
  if (!distance.value) {
    showToast('请输入跑步距离')
    return
  }

  if (!duration.value) {
    showToast('请输入跑步时长')
    return
  }

  try {
    const record = {
      date: currentDate.value,
      distance: parseFloat(distance.value),
      duration: parseFloat(duration.value),
      pace: parseFloat(averagePace.value),
      intensity: intensity.value,
      reflection: reflection.value
    }

    const records = JSON.parse(localStorage.getItem('runningRecords') || '[]')
    records.push(record)
    localStorage.setItem('runningRecords', JSON.stringify(records))

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

// 监听输入变化，实时计算配速
watch([distance, duration], () => {
  if (distance.value && duration.value) {
    const distanceNum = parseFloat(distance.value)
    const durationNum = parseFloat(duration.value)
    if (!isNaN(distanceNum) && !isNaN(durationNum) && distanceNum > 0) {
      // 配速会自动通过计算属性更新
    }
  }
})
</script>

<style scoped>
.running-checkin {
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
.distance-section,
.duration-section,
.pace-section,
.feeling-section,
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
