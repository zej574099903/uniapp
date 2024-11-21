<template>
  <div class="checkin-detail">
    <van-nav-bar
      title="读经打卡"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    
    <div class="content">
      <!-- 日期选择 -->
      <div class="date-section section-card">
        <div class="section-title">
          <i class="iconfont icon-calendar"></i>
          <span>{{ currentDate }} {{ weekday }}</span>
        </div>
      </div>

      <!-- 圣经选择 -->
      <div class="bible-section section-card">
        <div class="section-title">
          <i class="iconfont icon-book"></i>
          <span>选择经卷</span>
        </div>
        <div class="testament-tabs">
          <div 
            class="tab" 
            :class="{ active: testament === 'old' }"
            @click="testament = 'old'"
          >
            旧约
          </div>
          <div 
            class="tab"
            :class="{ active: testament === 'new' }"
            @click="testament = 'new'"
          >
            新约
          </div>
        </div>
        <div class="books-grid">
          <div 
            v-for="book in currentTestamentBooks"
            :key="book.name"
            class="book-item"
            :class="{ selected: selectedBook === book.name }"
            @click="selectBook(book)"
          >
            {{ book.name }}
            <span class="book-chapters">{{ book.chapters }}章</span>
          </div>
        </div>
      </div>

      <!-- 章节选择 -->
      <div class="chapter-section section-card" v-if="selectedBook">
        <div class="section-title">
          <i class="iconfont icon-chapter"></i>
          <span>章节选择</span>
        </div>
        <div class="chapter-range">
          <div class="range-item">
            <label>起始章节</label>
            <van-stepper 
              v-model="startChapter" 
              :min="1" 
              :max="selectedBookChapters"
            />
          </div>
          <div class="range-item">
            <label>已读章数</label>
            <van-stepper 
              v-model="chaptersRead" 
              :min="1" 
              :max="selectedBookChapters - startChapter + 1"
            />
          </div>
        </div>
      </div>

      <!-- 读经时长 -->
      <div class="duration-section section-card">
        <div class="section-title">
          <i class="iconfont icon-time"></i>
          <span>读经时长</span>
        </div>
        <div class="duration-buttons">
          <div 
            v-for="duration in durations"
            :key="duration"
            class="duration-btn"
            :class="{ active: selectedDuration === duration }"
            @click="selectedDuration = duration"
          >
            {{ duration }}分钟
          </div>
        </div>
      </div>

      <!-- 读经感想 -->
      <div class="reflection-section section-card">
        <div class="section-title">
          <i class="iconfont icon-edit"></i>
          <span>读经感想</span>
        </div>
        <van-field
          v-model="reflection"
          type="textarea"
          placeholder="记录今天的读经心得..."
          rows="4"
          autosize
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button 
          type="primary" 
          block 
          :disabled="!isValid"
          @click="handleSubmit"
        >
          提交打卡
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
const OLD_TESTAMENT = [
  { name: '创世记', chapters: 50 },
  { name: '出埃及记', chapters: 40 },
  { name: '利未记', chapters: 27 },
  // ... 其他旧约书卷
]

const NEW_TESTAMENT = [
  { name: '马太福音', chapters: 28 },
  { name: '马可福音', chapters: 16 },
  { name: '路加福音', chapters: 24 },
  // ... 其他新约书卷
]

export default {
  name: 'CheckinDetail',
  data() {
    return {
      currentDate: new Date().toLocaleDateString('zh-CN', { 
        month: 'long', 
        day: 'numeric' 
      }),
      weekday: new Date().toLocaleDateString('zh-CN', { weekday: 'long' }),
      testament: 'new',
      selectedBook: '',
      selectedBookData: null,
      startChapter: 1,
      chaptersRead: 1,
      durations: [15, 30, 45, 60, 90, 120],
      selectedDuration: 30,
      reflection: ''
    }
  },
  computed: {
    currentTestamentBooks() {
      return this.testament === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT
    },
    selectedBookChapters() {
      return this.selectedBookData?.chapters || 0
    },
    isValid() {
      return (
        this.selectedBook &&
        this.startChapter > 0 &&
        this.chaptersRead > 0 &&
        this.selectedDuration > 0
      )
    }
  },
  methods: {
    selectBook(book) {
      this.selectedBook = book.name
      this.selectedBookData = book
      this.startChapter = 1
      this.chaptersRead = 1
    },
    handleSubmit() {
      const record = {
        date: new Date().toISOString().split('T')[0],
        book: this.selectedBook,
        startChapter: this.startChapter,
        chaptersRead: this.chaptersRead,
        duration: this.selectedDuration,
        reflection: this.reflection
      }
      
      // 保存到 localStorage
      const records = JSON.parse(localStorage.getItem('bibleRecords') || '[]')
      records.push(record)
      localStorage.setItem('bibleRecords', JSON.stringify(records))
      
      // 显示成功提示
      this.$toast.success('打卡成功')
      
      // 返回首页
      setTimeout(() => {
        this.$router.push('/')
      }, 1500)
    }
  }
}
</script>

<style scoped>
.checkin-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
  padding-top: 46px;
  position: relative;
  overflow-x: hidden;
}

.checkin-detail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 25%);
  animation: patternMove 30s linear infinite;
  pointer-events: none;
}

@keyframes patternMove {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

.content {
  padding: 20px;
  position: relative;
  z-index: 1;
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
  color: #2d3748;
  margin-bottom: 20px;
}

.section-title i {
  font-size: 24px;
  color: #4a5568;
}

.testament-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  background: #edf2f7;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab.active {
  background: #2d3748;
  color: white;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.book-item {
  background: #edf2f7;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-item:hover {
  transform: translateY(-2px);
  background: #e2e8f0;
}

.book-item.selected {
  background: #2d3748;
  color: white;
}

.book-chapters {
  font-size: 12px;
  opacity: 0.7;
}

.chapter-range {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.range-item {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.range-item label {
  font-size: 14px;
  color: #4a5568;
}

.duration-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.duration-btn {
  background: #edf2f7;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.duration-btn:hover {
  transform: translateY(-2px);
}

.duration-btn.active {
  background: #2d3748;
  color: white;
}

:deep(.van-field__control) {
  background: transparent;
  border: 1px solid rgba(45, 55, 72, 0.1);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
}

:deep(.van-field__control:focus) {
  border-color: #2d3748;
  box-shadow: 0 0 0 3px rgba(45, 55, 72, 0.1);
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
  background: linear-gradient(135deg, #2d3748 0%, #1a365d 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(26, 54, 93, 0.2);
  transition: all 0.3s ease;
}

:deep(.van-button--primary:active) {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(26, 54, 93, 0.15);
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
.section-card:nth-child(5) { animation-delay: 0.4s; }

/* 自定义滚动条 */
.books-grid::-webkit-scrollbar {
  width: 6px;
}

.books-grid::-webkit-scrollbar-track {
  background: #edf2f7;
  border-radius: 3px;
}

.books-grid::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.books-grid::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

@media (max-width: 360px) {
  .content {
    padding: 16px;
  }
  
  .section-card {
    padding: 20px;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
  
  .duration-buttons {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }
}
</style>
