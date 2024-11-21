// 圣经卷数据
export const bibleBooks = [
  // 旧约
  { name: '创世记', chapters: 50 },
  { name: '出埃及记', chapters: 40 },
  { name: '利未记', chapters: 27 },
  { name: '民数记', chapters: 36 },
  { name: '申命记', chapters: 34 },
  { name: '约书亚记', chapters: 24 },
  { name: '士师记', chapters: 21 },
  { name: '路得记', chapters: 4 },
  { name: '撒母耳记上', chapters: 31 },
  { name: '撒母耳记下', chapters: 24 },
  { name: '列王记上', chapters: 22 },
  { name: '列王记下', chapters: 25 },
  { name: '历代志上', chapters: 29 },
  { name: '历代志下', chapters: 36 },
  { name: '以斯拉记', chapters: 10 },
  { name: '尼希米记', chapters: 13 },
  { name: '以斯帖记', chapters: 10 },
  { name: '约伯记', chapters: 42 },
  { name: '诗篇', chapters: 150 },
  { name: '箴言', chapters: 31 },
  { name: '传道书', chapters: 12 },
  { name: '雅歌', chapters: 8 },
  { name: '以赛亚书', chapters: 66 },
  { name: '耶利米书', chapters: 52 },
  { name: '耶利米哀歌', chapters: 5 },
  { name: '以西结书', chapters: 48 },
  { name: '但以理书', chapters: 12 },
  { name: '何西阿书', chapters: 14 },
  { name: '约珥书', chapters: 3 },
  { name: '阿摩司书', chapters: 9 },
  { name: '俄巴底亚书', chapters: 1 },
  { name: '约拿书', chapters: 4 },
  { name: '弥迦书', chapters: 7 },
  { name: '那鸿书', chapters: 3 },
  { name: '哈巴谷书', chapters: 3 },
  { name: '西番雅书', chapters: 3 },
  { name: '哈该书', chapters: 2 },
  { name: '撒迦利亚书', chapters: 14 },
  { name: '玛拉基书', chapters: 4 },

  // 新约
  { name: '马太福音', chapters: 28 },
  { name: '马可福音', chapters: 16 },
  { name: '路加福音', chapters: 24 },
  { name: '约翰福音', chapters: 21 },
  { name: '使徒行传', chapters: 28 },
  { name: '罗马书', chapters: 16 },
  { name: '哥林多前书', chapters: 16 },
  { name: '哥林多后书', chapters: 13 },
  { name: '加拉太书', chapters: 6 },
  { name: '以弗所书', chapters: 6 },
  { name: '腓立比书', chapters: 4 },
  { name: '歌罗西书', chapters: 4 },
  { name: '帖撒罗尼迦前书', chapters: 5 },
  { name: '帖撒罗尼迦后书', chapters: 3 },
  { name: '提摩太前书', chapters: 6 },
  { name: '提摩太后书', chapters: 4 },
  { name: '提多书', chapters: 3 },
  { name: '腓利门书', chapters: 1 },
  { name: '希伯来书', chapters: 13 },
  { name: '雅各书', chapters: 5 },
  { name: '彼得前书', chapters: 5 },
  { name: '彼得后书', chapters: 3 },
  { name: '约翰一书', chapters: 5 },
  { name: '约翰二书', chapters: 1 },
  { name: '约翰三书', chapters: 1 },
  { name: '犹大书', chapters: 1 },
  { name: '启示录', chapters: 22 }
]

// 获取圣经卷总章数
export const getTotalChapters = (bookName) => {
  const book = bibleBooks.find(b => b.name === bookName)
  return book ? book.chapters : 0
}

// 检查章节是否有效
export const isValidChapter = (bookName, chapter) => {
  const totalChapters = getTotalChapters(bookName)
  return chapter > 0 && chapter <= totalChapters
}

// 检查章节范围是否有效
export const isValidChapterRange = (bookName, startChapter, endChapter) => {
  const totalChapters = getTotalChapters(bookName)
  return (
    startChapter > 0 &&
    endChapter > 0 &&
    startChapter <= totalChapters &&
    endChapter <= totalChapters &&
    startChapter <= endChapter
  )
}

// 计算已读章数
export const calculateChaptersRead = (startChapter, endChapter) => {
  if (!startChapter || !endChapter) return 0
  const start = parseInt(startChapter)
  const end = parseInt(endChapter)
  if (isNaN(start) || isNaN(end)) return 0
  return end - start + 1
}
