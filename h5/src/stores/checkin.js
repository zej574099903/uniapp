import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { formatDate } from '../utils/date'

export const useCheckinStore = defineStore('checkin', () => {
  // 初始化存储结构
  const spiritualCheckins = ref({
    bibleReadings: {}
  })

  // 获取今日日期
  const today = computed(() => formatDate(new Date()))

  // 今日完成数量
  const todayCompletionCount = computed(() => {
    const todayBible = getTodayBibleReading()
    return todayBible.completed ? 1 : 0
  })

  // 获取今日读经记录
  const getTodayBibleReading = () => {
    if (!spiritualCheckins.value.bibleReadings[today.value]) {
      spiritualCheckins.value.bibleReadings[today.value] = { 
        completed: false, 
        book: '', 
        startChapter: 1,
        chaptersRead: 0,
        content: '' 
      }
    }
    return spiritualCheckins.value.bibleReadings[today.value]
  }

  // 记录读经
  const recordBibleReading = (data) => {
    const newRecord = {
      completed: true,
      book: data.book || '',
      startChapter: data.startChapter || 1,
      chaptersRead: data.chaptersRead || 1,
      content: data.content || ''
    }
    spiritualCheckins.value.bibleReadings[today.value] = newRecord
    saveToLocalStorage()
    return newRecord
  }

  // 获取指定日期的完成状态
  const getDateCompletionStatus = (date) => {
    const bibleCompleted = spiritualCheckins.value.bibleReadings[date]?.completed || false
    return {
      completed: bibleCompleted,
      bibleCompleted,
      total: bibleCompleted ? 1 : 0
    }
  }

  // 从localStorage加载数据
  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('spiritualCheckins')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        spiritualCheckins.value = {
          bibleReadings: parsed.bibleReadings || {}
        }
      } catch (e) {
        console.error('Failed to parse saved data:', e)
        spiritualCheckins.value = {
          bibleReadings: {}
        }
      }
    }
  }

  // 保存到localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('spiritualCheckins', JSON.stringify(spiritualCheckins.value))
    } catch (e) {
      console.error('Failed to save data:', e)
    }
  }

  return {
    spiritualCheckins,
    todayCompletionCount,
    getTodayBibleReading,
    recordBibleReading,
    getDateCompletionStatus,
    loadFromLocalStorage,
    saveToLocalStorage
  }
})
