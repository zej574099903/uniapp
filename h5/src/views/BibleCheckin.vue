<template>
  <div class="bible-checkin">
    <van-nav-bar
      title="今日读经打卡"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    
    <div class="content">
      <!-- 日期选择 -->
      <div class="date-section section-card">
        <div class="section-title">
          <i class="iconfont icon-calendar"></i>
          <span>打卡日期</span>
        </div>
        <van-cell-group inset>
          <van-cell :title="currentDate" />
        </van-cell-group>
      </div>

      <!-- 阅读时长 -->
      <div class="duration-section section-card">
        <div class="section-title">
          <i class="iconfont icon-time"></i>
          <span>阅读时长</span>
        </div>
        <div class="quick-duration-buttons">
          <van-button 
            v-for="duration in durations"
            :key="duration"
            type="primary"
            size="small"
            :disabled="isCheckedIn"
            @click="handleDurationSelect(duration)"
          >
            {{ duration }}分钟
          </van-button>
        </div>
      </div>

      <!-- 阅读内容 -->
      <div class="reading-section section-card">
        <div class="section-title">
          <i class="iconfont icon-book"></i>
          <span>阅读内容</span>
        </div>
        <div class="bible-books">
          <div class="testament old-testament">
            <h3>旧约</h3>
            <div class="book-grid">
              <div 
                v-for="book in oldTestament"
                :key="book"
                class="book-item"
                :class="{ selected: selectedBooks.includes(book) }"
                @click="toggleBook(book)"
              >
                {{ book }}
              </div>
            </div>
          </div>
          <div class="testament new-testament">
            <h3>新约</h3>
            <div class="book-grid">
              <div 
                v-for="book in newTestament"
                :key="book"
                class="book-item"
                :class="{ selected: selectedBooks.includes(book) }"
                @click="toggleBook(book)"
              >
                {{ book }}
              </div>
            </div>
          </div>
        </div>
        <van-field
          v-model="chapters"
          label="章节"
          placeholder="例如: 1-3章"
          :disabled="isCheckedIn"
        />
      </div>

      <!-- 心得感想 -->
      <div class="reflection-section section-card">
        <div class="section-title">
          <i class="iconfont icon-edit"></i>
          <span>心得感想</span>
        </div>
        <van-field
          v-model="reflection"
          type="textarea"
          placeholder="分享今天的读经感受..."
          rows="4"
          autosize
          :disabled="isCheckedIn"
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section" v-if="!isCheckedIn">
        <van-button type="primary" block @click="handleSubmit">
          提交打卡
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BibleCheckin',
  data() {
    return {
      currentDate: new Date().toLocaleDateString(),
      duration: '',
      durations: [15, 30, 45, 60, 90, 120],
      oldTestament: ['创世记', '出埃及记', '利未记', '民数记', '申命记'],  // 可以继续添加
      newTestament: ['马太福音', '马可福音', '路加福音', '约翰福音', '使徒行传'],  // 可以继续添加
      selectedBooks: [],
      chapters: '',
      reflection: '',
      isCheckedIn: false
    }
  },
  methods: {
    handleDurationSelect(duration) {
      this.duration = duration
    },
    toggleBook(book) {
      if (this.isCheckedIn) return
      const index = this.selectedBooks.indexOf(book)
      if (index === -1) {
        this.selectedBooks.push(book)
      } else {
        this.selectedBooks.splice(index, 1)
      }
    },
    handleSubmit() {
      // 实现提交逻辑
      this.isCheckedIn = true
    }
  }
}
</script>

<style scoped>
.bible-checkin {
  min-height: 100vh;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
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

.bible-checkin::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 25%);
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
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 20px;
}

.section-title i {
  font-size: 24px;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.quick-duration-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-duration-buttons .van-button {
  min-width: 80px;
  border-radius: 12px;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  border: none;
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.2);
  transition: all 0.3s ease;
}

.quick-duration-buttons .van-button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.15);
}

.bible-books {
  margin-bottom: 20px;
}

.testament {
  margin-bottom: 24px;
}

.testament h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #1e3c72;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

.book-item {
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.book-item::before {
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

.book-item:hover::before {
  transform: translateX(100%);
}

.book-item.selected {
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  color: white;
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.2);
}

:deep(.van-field__control) {
  background: transparent;
  border: 1px solid rgba(30, 60, 114, 0.1);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
}

:deep(.van-field__control:focus) {
  border-color: #1e3c72;
  box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
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
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  border: none;
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.2);
  transition: all 0.3s ease;
}

:deep(.van-button--primary:active) {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.15);
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

@media (max-width: 360px) {
  .content {
    padding: 16px;
  }
  
  .section-card {
    padding: 20px;
  }
  
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }
  
  .book-item {
    font-size: 12px;
    padding: 6px 8px;
  }
}
</style>
