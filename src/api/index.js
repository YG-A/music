// 这个js文件用于专门管理请求各种结构地址的
import Network from './network'

// http://127.0.0.1:3000/banner?type=2
export const getBanner = () => Network.get('/banner?type=2')

// 推荐歌单/personalized?limit=num值
export const getPersonalized = () => Network.get('/personalized?limit=6')

// 最新专辑/album/newest
export const getNewAlbum = () => Network.get('/album/newest')

// 推荐新音乐/personalized/newsong
export const getNewSong = () => Network.get('/personalized/newsong')

// 歌单详情 /playlist/detail?id=24381616
export const getPlayList = (data) => Network.get('/playlist/detail', data)

// 专辑详情
export const getAlbum = (data) => Network.get('/album', data)

// 歌曲详情/song/detail?ids=347230
export const getSongDetail = (data) => Network.get('/song/detail', data)

// 根据id获取歌词信息
export const getLyric = (data) => Network.get('/lyric', data)

// 根据id获取歌曲的url资源
export const getSongURL = (data) => Network.get('/song/url', data)

// 获取热门歌手/top/artists?offset=0&limit=30
export const getHotArtists = () => {
  return new Promise((resolve, reject) => {
    Network.get('/top/artists?offset=0&limit=5').then((result) => {
      resolve(result.artists)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 获取热门歌手a~z开头的歌手/artist/list?cat=1001&initial=b
export const getLetterArtists = (letter) => {
  return new Promise((resolve, reject) => {
    const letterArtists = []
    Network.all([
      Network.get(`/artist/list?offset=0&limit=5&cat=5001&initial=${letter}`)
      // Network.get(`/artist/list?offset=0&limit=5&cat=1001&initial=${letter}`)
      // Network.get(`/artist/list?offset=0&limit=5&cat=1002&initial=${letter}`),
      // Network.get(`/artist/list?offset=0&limit=5&cat=1003&initial=${letter}`)
      // Network.get(`/artist/list?offset=0&limit=5&cat=2001&initial=${letter}`),
      // Network.get(`/artist/list?offset=0&limit=5&cat=2002&initial=${letter}`),
      // Network.get(`/artist/list?offset=0&limit=5&cat=2003&initial=${letter}`)
    ]).then((result) => {
      result.forEach(item => {
        letterArtists.push(...item.artists)
      })
      resolve(letterArtists)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const getAllArtists = (letter) => {
  const keys = ['热']
  const list = [getHotArtists()]
  return new Promise((resolve, reject) => {
    for (let i = 65; i < 91; i++) {
      const char = String.fromCharCode(i)
      keys.push(char)
      list.push(getLetterArtists(char))
    }
    Network.all(list).then((result) => {
      const obj = {}
      obj.keys = keys
      obj.list = result
      resolve(obj)
    }).catch((error) => {
      // console.log(error)
      reject(error)
    })
  })
}

// 获取某个歌手的单曲
export const getArtistsSongs = (data) => Network.get('/artists', data)

// 调用此接口,可获取所有榜单内容摘要
export const getTopListDetail = () => {
  return new Promise((resolve, reject) => {
    const category = {
      officialList: [
        { name: '飙升榜', id: 3 },
        { name: '新歌榜', id: 0 },
        { name: '原创榜', id: 2 },
        { name: '热歌榜', id: 1 }
      ],
      recList: [
        { name: '云音乐说唱榜', id: 23 },
        { name: '云音乐电音榜', id: 25 },
        { name: '云音乐欧美新歌榜', id: 32 },
        { name: '云音乐韩语榜', id: 26 },
        { name: '云音乐ACG榜', id: 22 },
        { name: '云音乐古典榜', id: 24 }
      ],
      globalList: [
        { name: '美国Billboard榜', id: 6 },
        { name: 'UK排行榜周榜', id: 5 },
        { name: 'Beatport全球电子舞曲榜', id: 21 },
        { name: '日本Oricon榜', id: 10 },
        { name: '黑胶VIP爱听榜', id: 8 },
        { name: '云音乐日语榜', id: 29 }
      ],
      otherList: [
        { name: 'KTV唛榜', id: 7 },
        { name: '法国 NRJ Vos Hits 周榜', id: 19 },
        { name: '云音乐ACG动画榜', id: 27 },
        { name: '中文DJ榜', id: 28 },
        { name: '云音乐ACG游戏榜', id: 30 },
        { name: '云音乐欧美热歌榜', id: 31 }
      ],
      titles: { officialList: '官方榜', recList: '推荐榜', globalList: '全球榜', otherList: '更多榜单' }
    }
    Network.get('/toplist/detail').then((data) => {
      data.list.forEach((item) => {
        let flag = false
        for (const key in category) {
          for (let i = 0; i < category[key].length; i++) {
            if (category[key][i].name === item.name) {
              category[key][i].rank = item
              flag = true
              break
            }
          }
          if (flag) { break }
        }
      })
      resolve(category)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 获取某排行榜的单曲/top/list?idx=6
export const getRankSongs = (data) => Network.get('/top/list', data)

// 搜索关键词可获得搜索建议/search/suggest?keywords= 海阔天空
export const getSearchSuggest = (data) => Network.get('/search/suggest?type=mobile', data)

// 搜索结果
export const getSearchList = (data) => Network.get('/search', data)

// 热门搜索
export const getHotSearch = () => Network.get('/search/hot')
