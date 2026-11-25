// 沐辰 2026 川西与西昌十二日旅行完整纪实数据（10.29 - 11.09）
// 所有文案均忠实取自妈妈朋友圈原文，所有照片均取自对应原图

window.SITE_DATA = {
  momName: "老妈",
  wechatName: "沐辰",
  signature: "借时光之手，暖一束花开",
  birthdayDate: "2026年11月25日",
  tripRange: "2026.10.29 — 2026.11.09",

  tracks: [
    {
      id: "spring",
      title: "Spring Subway（开往春天的地铁）",
      shortTitle: "Spring Subway",
      artist: "Varlan",
      chapterRange: "生日开篇 · 双桥沟与旱獭",
      bpm: 71,
      beatSec: 0.845,
      motionMood: "crisp",
      src: "assets/audio/spring-subway.mp3"
    },
    {
      id: "hometown",
      title: "故郷の原風景（故乡的原风景）",
      shortTitle: "故乡的原风景",
      artist: "宗次郎",
      chapterRange: "稻城亚丁 · 墨石 · 八郎生都 · 理塘雅拉",
      bpm: 64,
      beatSec: 0.938,
      motionMood: "majestic",
      src: "assets/audio/hometown-ocarina.mp3"
    },
    {
      id: "chengdu",
      title: "成都",
      shortTitle: "成都",
      artist: "赵雷",
      chapterRange: "康定 · 泸定桥 · 成都老茶馆 · 兴文溶洞",
      bpm: 90,
      beatSec: 0.667,
      motionMood: "folk",
      src: "assets/audio/chengdu.mp3"
    },
    {
      id: "sunset",
      title: "SUNSET IN THE LAKE",
      shortTitle: "SUNSET IN THE LAKE",
      artist: "DAISHI DANCE / 姫神",
      chapterRange: "大石板 · 建昌灯火 · 邛海日落与尾声",
      bpm: 118,
      beatSec: 0.508,
      motionMood: "luminous",
      src: "assets/audio/sunset-in-the-lake.mp3"
    }
  ],

  // 每个页面区段默认对应的乐章索引
  sectionTrackMap: {
    "top": 0,
    "birthday": 0,
    "route": 0,
    "ch-1029": 0,
    "ch-1030": 0,
    "ch-1031": 1,
    "ch-1101": 1,
    "ch-1102": 1,
    "ch-1103": 1,
    "ch-1104": 1,
    "ch-1105": 2,
    "ch-1106": 2,
    "ch-1107": 2,
    "ch-1108": 3,
    "ch-1109": 3,
    "finale": 3
  },

  heroSlides: [
    "assets/photos/10-29/01.jpg",
    "assets/photos/10-31/05.jpg",
    "assets/photos/11-03/01.jpg",
    "assets/photos/11-09-qh/04.jpg"
  ],

  coverPhoto: "assets/photos/cover/milk-lake.jpg",

  // 行程路线图节点（SVG 坐标系 0..1000 x 0..320）
  routeStops: [
    { id: "day-1029", date: "10.29", label: "双桥沟彩林", elev: "3,480m", x: 86,  y: 162, chapterId: "ch-1029" },
    { id: "day-1030", date: "10.30", label: "旱獭偶遇",   elev: "3,800m", x: 162, y: 136, chapterId: "ch-1030" },
    { id: "day-1031", date: "10.31", label: "稻城亚丁",   elev: "4,600m", x: 248, y: 52,  chapterId: "ch-1031", peak: true },
    { id: "day-1101", date: "11.01", label: "墨石公园",   elev: "3,500m", x: 334, y: 146, chapterId: "ch-1101" },
    { id: "day-1102", date: "11.02", label: "姑弄村",     elev: "3,700m", x: 412, y: 124, chapterId: "ch-1102" },
    { id: "day-1103", date: "11.03", label: "八郎生都",   elev: "4,340m", x: 492, y: 74,  chapterId: "ch-1103", peak: true },
    { id: "day-1104", date: "11.04", label: "理塘·雅拉",  elev: "4,014m", x: 576, y: 96,  chapterId: "ch-1104" },
    { id: "day-1105", date: "11.05", label: "康定·泸定",  elev: "1,320m", x: 660, y: 204, chapterId: "ch-1105" },
    { id: "day-1106", date: "11.06", label: "成都茶馆",   elev: "500m",   x: 742, y: 256, chapterId: "ch-1106" },
    { id: "day-1107", date: "11.07", label: "兴文天泉洞", elev: "820m",   x: 822, y: 238, chapterId: "ch-1107" },
    { id: "day-1108", date: "11.08", label: "螺髻·大石板",elev: "1,560m", x: 896, y: 192, chapterId: "ch-1108" },
    { id: "day-1109", date: "11.09", label: "建昌·邛海",  elev: "1,510m", x: 962, y: 196, chapterId: "ch-1109" }
  ],

  chapters: [
    {
      id: "ch-1029",
      dayNum: "DAY 01",
      date: "10月29日",
      shortDate: "10.29",
      timestamp: "2026年10月29日 23:34",
      location: "川西 · 雪山与彩林",
      elevation: "3,480m",
      theme: "autumn",
      accent: "#C88A32",
      tagline: "序章 · 金秋封神",
      entries: [
        {
          caption: "雪山配彩林，川西已到了封神的季节",
          time: "23:34",
          layout: "editorial-9",
          photos: [
            { src: "assets/photos/10-29/01.jpg", thumb: "assets/thumbs/10-29/01.jpg", orient: "L", alt: "雪峰与金色落叶松彩林" },
            { src: "assets/photos/10-29/02.jpg", thumb: "assets/thumbs/10-29/02.jpg", orient: "L", alt: "高原海子倒映雪山与秋色" },
            { src: "assets/photos/10-29/03.jpg", thumb: "assets/thumbs/10-29/03.jpg", orient: "P", alt: "张开双臂拥抱雪山秋光" },
            { src: "assets/photos/10-29/04.jpg", thumb: "assets/thumbs/10-29/04.jpg", orient: "P", alt: "灿烂笑容与漫山金黄" },
            { src: "assets/photos/10-29/05.jpg", thumb: "assets/thumbs/10-29/05.jpg", orient: "P", alt: "驻足远望雪峰与草甸" },
            { src: "assets/photos/10-29/06.jpg", thumb: "assets/thumbs/10-29/06.jpg", orient: "L", alt: "澄澈湖面倒映蓝天雪峰" },
            { src: "assets/photos/10-29/07.jpg", thumb: "assets/thumbs/10-29/07.jpg", orient: "P", alt: "川西彩林公路上的身影" },
            { src: "assets/photos/10-29/08.jpg", thumb: "assets/thumbs/10-29/08.jpg", orient: "L", alt: "层林尽染的秋日山谷" },
            { src: "assets/photos/10-29/09.jpg", thumb: "assets/thumbs/10-29/09.jpg", orient: "L", alt: "通往雪山的笔直公路" }
          ]
        }
      ]
    },
    {
      id: "ch-1030",
      dayNum: "DAY 02",
      date: "10月30日",
      shortDate: "10.30",
      timestamp: "2026年10月30日 12:26",
      location: "川西高原 · 山野奇遇",
      elevation: "3,800m",
      theme: "marmot",
      accent: "#9C7B42",
      tagline: "趣闻 · 高原萌友",
      special: "marmot-cracker",
      entries: [
        {
          caption: "别打了，雪饼我给",
          time: "12:26",
          layout: "spotlight-1",
          photos: [
            { src: "assets/photos/10-30-vid/still.jpg", thumb: "assets/thumbs/10-30-vid/still.jpg", orient: "L", alt: "石峰前两只土拨鼠认真摔跤" }
          ]
        }
      ]
    },
    {
      id: "ch-1031",
      dayNum: "DAY 03",
      date: "10月31日",
      shortDate: "10.31",
      timestamp: "2026年10月31日",
      location: "稻城亚丁 · 牛奶海与五色海",
      elevation: "4,600m",
      theme: "glacier",
      accent: "#2A8A9C",
      tagline: "巅峰 · 零吸氧登顶",
      badge: "4,600m 零吸氧登顶成就达成",
      entries: [
        {
          caption: "世界这本书，我又翻了一页\n有些地方，要走很远才到达\n稻城亚丁⛰️ 7:00出发，20:00到达，辛苦是真的，但到了才知道，那些路都值得\n十月末的稻城，雪山白得发亮，草甸黄得温柔，海子蓝得仿佛刺破了天空\n这就是秋天的童话",
          time: "00:15",
          layout: "journal-note",
          noteTitle: "旅途手记 · 十三小时奔赴秋天的童话"
        },
        {
          caption: "挑战的是海拔，更是自己，零吸氧登顶👍",
          time: "23:02",
          layout: "editorial-9",
          photos: [
            { src: "assets/photos/10-31/01.jpg", thumb: "assets/thumbs/10-31/01.jpg", orient: "L", alt: "五色海深邃湛蓝的高原秘境" },
            { src: "assets/photos/10-31/02.jpg", thumb: "assets/thumbs/10-31/02.jpg", orient: "P", alt: "神山脚下的彩林与藏寺" },
            { src: "assets/photos/10-31/03.jpg", thumb: "assets/thumbs/10-31/03.jpg", orient: "P", alt: "央迈勇雪峰与金色洛绒牛场" },
            { src: "assets/photos/10-31/04.jpg", thumb: "assets/thumbs/10-31/04.jpg", orient: "P", alt: "日照金山映照冰川溪流" },
            { src: "assets/photos/10-31/05.jpg", thumb: "assets/thumbs/10-31/05.jpg", orient: "L", alt: "俯瞰雪山环抱中的牛奶海" },
            { src: "assets/photos/10-31/06.jpg", thumb: "assets/thumbs/10-31/06.jpg", orient: "L", alt: "冲古寺秋阳与金树" },
            { src: "assets/photos/10-31/07.jpg", thumb: "assets/thumbs/10-31/07.jpg", orient: "P", alt: "零吸氧登顶牛奶海留念" },
            { src: "assets/photos/10-31/08.jpg", thumb: "assets/thumbs/10-31/08.jpg", orient: "L", alt: "高山海子与漫山红黄草甸" },
            { src: "assets/photos/10-31/09.jpg", thumb: "assets/thumbs/10-31/09.jpg", orient: "P", alt: "面对雪山高举双臂欢呼" }
          ]
        }
      ]
    },
    {
      id: "ch-1101",
      dayNum: "DAY 04",
      date: "11月01日",
      shortDate: "11.01",
      timestamp: "2026年11月1日",
      location: "甘孜 · 墨石公园",
      elevation: "3,500m",
      theme: "obsidian",
      accent: "#5C6F82",
      tagline: "异星 · 暗黑浪漫",
      entries: [
        {
          caption: "亿万年的地壳褶皱\n这是川西的暗黑浪漫",
          time: "11月1日",
          layout: "editorial-9",
          photos: [
            { src: "assets/photos/11-01/01.jpg", thumb: "assets/thumbs/11-01/01.jpg", orient: "P", alt: "阳光刺破糜棱岩石林峰脊" },
            { src: "assets/photos/11-01/02.jpg", thumb: "assets/thumbs/11-01/02.jpg", orient: "L", alt: "幽蓝灰岩间的秋叶与栈道" },
            { src: "assets/photos/11-01/03.jpg", thumb: "assets/thumbs/11-01/03.jpg", orient: "L", alt: "亿万年地质褶皱奇观" },
            { src: "assets/photos/11-01/04.jpg", thumb: "assets/thumbs/11-01/04.jpg", orient: "L", alt: "蓝天下的异域墨石群峰" },
            { src: "assets/photos/11-01/05.jpg", thumb: "assets/thumbs/11-01/05.jpg", orient: "P", alt: "草坡上呆萌张望的土拨鼠" },
            { src: "assets/photos/11-01/06.jpg", thumb: "assets/thumbs/11-01/06.jpg", orient: "L", alt: "连绵起伏的灰黑石林全景" },
            { src: "assets/photos/11-01/07.jpg", thumb: "assets/thumbs/11-01/07.jpg", orient: "P", alt: "318 路标与宇航员打卡" },
            { src: "assets/photos/11-01/08.jpg", thumb: "assets/thumbs/11-01/08.jpg", orient: "P", alt: "一袭红衣攀立墨石崖畔" },
            { src: "assets/photos/11-01/09.jpg", thumb: "assets/thumbs/11-01/09.jpg", orient: "L", alt: "冷峻深邃的墨石沟壑" }
          ]
        }
      ]
    },
    {
      id: "ch-1102",
      dayNum: "DAY 05",
      date: "11月02日",
      shortDate: "11.02",
      timestamp: "2026年11月2日 17:13",
      location: "塔公 · 姑弄村",
      elevation: "3,700m",
      theme: "interlude",
      accent: "#B8843D",
      tagline: "慢行 · 旷野午后",
      entries: [
        {
          caption: "来姑弄村，浪费一个下午",
          time: "17:13",
          layout: "journal-note",
          noteTitle: "高原慢时光 · 溪流、牧场与雅拉雪山下的微风",
          poeticSub: "把行程表折进兜里，晒太阳、看云移，把一整个秋日午后大方地交给风。"
        }
      ]
    },
    {
      id: "ch-1103",
      dayNum: "DAY 06",
      date: "11月03日",
      shortDate: "11.03",
      timestamp: "2026年11月3日",
      location: "八郎生都 · 星空营地",
      elevation: "4,340m",
      theme: "sky",
      accent: "#2E6FB8",
      tagline: "穹顶 · 360° 雪山浪漫",
      entries: [
        {
          caption: "八郎生都\n拥有360°雪山环绕的浪漫",
          time: "11月3日",
          layout: "editorial-9",
          photos: [
            { src: "assets/photos/11-03/01.jpg", thumb: "assets/thumbs/11-03/01.jpg", orient: "L", alt: "夕阳余晖洒满巍峨雪峰" },
            { src: "assets/photos/11-03/02.jpg", thumb: "assets/thumbs/11-03/02.jpg", orient: "P", alt: "湛蓝苍穹下的侧颜留影" },
            { src: "assets/photos/11-03/03.jpg", thumb: "assets/thumbs/11-03/03.jpg", orient: "P", alt: "高原地标石碑与无垠晴空" },
            { src: "assets/photos/11-03/04.jpg", thumb: "assets/thumbs/11-03/04.jpg", orient: "L", alt: "风中祈福的五彩玛尼堆" },
            { src: "assets/photos/11-03/05.jpg", thumb: "assets/thumbs/11-03/05.jpg", orient: "P", alt: "漫天经幡天幕下的飒爽身影" },
            { src: "assets/photos/11-03/06.jpg", thumb: "assets/thumbs/11-03/06.jpg", orient: "L", alt: "雪山背景前的木架秋千" },
            { src: "assets/photos/11-03/07.jpg", thumb: "assets/thumbs/11-03/07.jpg", orient: "L", alt: "镜面水台与雪山云端起舞" },
            { src: "assets/photos/11-03/08.jpg", thumb: "assets/thumbs/11-03/08.jpg", orient: "L", alt: "八郎生都 Balang Sumdho" },
            { src: "assets/photos/11-03/09.jpg", thumb: "assets/thumbs/11-03/09.jpg", orient: "L", alt: "一排静谧庄严的高原白塔" }
          ]
        }
      ]
    },
    {
      id: "ch-1104",
      dayNum: "DAY 07",
      date: "11月04日",
      shortDate: "11.04",
      timestamp: "2026年11月4日",
      location: "世界高城理塘 · 雅拉雪山",
      elevation: "4,014m",
      theme: "plateau-dark",
      accent: "#D9603B",
      tagline: "信仰 · 此生一一抵达",
      entries: [
        {
          caption: "爬上东山顶，看长青春科尔寺静立，看千户藏寨藏着人间烟火，来仁康古街追寻旧时光，风中有酥油的香气，耳边有缓缓转动的经筒声，这就是世界高城 -- 理塘",
          time: "10:11",
          layout: "journal-note",
          noteTitle: "世界高城 · 理塘拾光"
        },
        {
          caption: "不爱城市霓虹喧嚣，也不恋远方异国。心之所向唯有高原旷野，这里氧气稀薄，信仰却足够厚重。当双脚抵达，心底那股感动，难以言喻。前路尚有无数山河未曾相逢，慢慢走，此生一一抵达。\n2026年秋于雅（亚）拉雪山",
          time: "11月4日",
          layout: "editorial-9",
          photos: [
            { src: "assets/photos/11-04/01.jpg", thumb: "assets/thumbs/11-04/01.jpg", orient: "L", alt: "雪山旷野前张开双臂的剪影" },
            { src: "assets/photos/11-04/02.jpg", thumb: "assets/thumbs/11-04/02.jpg", orient: "P", alt: "立于越野车顶远眺雅拉神山" },
            { src: "assets/photos/11-04/03.jpg", thumb: "assets/thumbs/11-04/03.jpg", orient: "P", alt: "阳光洒满五彩风马经幡长廊" },
            { src: "assets/photos/11-04/04.jpg", thumb: "assets/thumbs/11-04/04.jpg", orient: "P", alt: "318 此生必驾 · 亚拉雪山观景台" },
            { src: "assets/photos/11-04/05.jpg", thumb: "assets/thumbs/11-04/05.jpg", orient: "P", alt: "巍峨如莲花王座的雅拉主峰" },
            { src: "assets/photos/11-04/06.jpg", thumb: "assets/thumbs/11-04/06.jpg", orient: "P", alt: "炽烈色彩经幡旁的笑颜" },
            { src: "assets/photos/11-04/07.jpg", thumb: "assets/thumbs/11-04/07.jpg", orient: "L", alt: "你们上班吧，我来亚拉雪山了" },
            { src: "assets/photos/11-04/08.jpg", thumb: "assets/thumbs/11-04/08.jpg", orient: "P", alt: "向金色秋空撒起祝福的风马" },
            { src: "assets/photos/11-04/09.jpg", thumb: "assets/thumbs/11-04/09.jpg", orient: "L", alt: "晴空下与雅拉雪山石碑合影" }
          ]
        }
      ]
    },
    {
      id: "ch-1105",
      dayNum: "DAY 08",
      date: "11月05日",
      shortDate: "11.05",
      timestamp: "2026年11月5日",
      location: "康定情歌故里 · 泸定铁索桥",
      elevation: "1,320m",
      theme: "interlude",
      accent: "#B84A39",
      tagline: "风情 · 跑马溜溜与大渡河风",
      entries: [
        {
          caption: "折多河穿城奔流，群山环抱着情歌故里，康定到此一遇，体会那句跑马溜溜的浪漫",
          time: "11:54",
          layout: "journal-note",
          noteTitle: "康定 · 情歌故里"
        },
        {
          caption: "终于来到课本里的泸定桥啦\n踏泸定铁索，风摇桥晃，铁索凌空，心中肃然，手更不敢松，生怕手机奔赴大渡河",
          time: "16:53",
          layout: "journal-note",
          noteTitle: "泸定桥 · 铁索凌空"
        }
      ]
    },
    {
      id: "ch-1106",
      dayNum: "DAY 09",
      date: "11月06日",
      shortDate: "11.06",
      timestamp: "2026年11月6日",
      location: "一路高歌 · 成都老茶馆",
      elevation: "500m",
      theme: "teahouse",
      accent: "#B63D32",
      tagline: "巴适 · 一盏好茶半日闲",
      entries: [
        {
          caption: "答案在路上，自由在风里\n一路高歌一路嗨",
          time: "09:57",
          layout: "journal-note",
          noteTitle: "在路上 · 自由高歌"
        },
        {
          caption: "来成都老茶馆，点一盏好茶、得半日清闲，听旁人摆龙门阵，看台上脸谱变换，慢慢悠悠，任时光慢慢流走",
          time: "14:55",
          layout: "editorial-6",
          photos: [
            { src: "assets/photos/11-06/01.jpg", thumb: "assets/thumbs/11-06/01.jpg", orient: "L", alt: "高朋满座的成都老茶馆中庭" },
            { src: "assets/photos/11-06/02.jpg", thumb: "assets/thumbs/11-06/02.jpg", orient: "P", alt: "朱红长阶上的茶艺长嘴壶表演" },
            { src: "assets/photos/11-06/03.jpg", thumb: "assets/thumbs/11-06/03.jpg", orient: "P", alt: "人声鼎沸的巴蜀烟火茶席" },
            { src: "assets/photos/11-06/04.jpg", thumb: "assets/thumbs/11-06/04.jpg", orient: "L", alt: "盖碗清茶配花生瓜子" },
            { src: "assets/photos/11-06/05.jpg", thumb: "assets/thumbs/11-06/05.jpg", orient: "L", alt: "红毯台阶上自在小憩" },
            { src: "assets/photos/11-06/06.jpg", thumb: "assets/thumbs/11-06/06.jpg", orient: "P", alt: "精彩绝伦的川剧变脸绝活" }
          ]
        }
      ]
    },
    {
      id: "ch-1107",
      dayNum: "DAY 10",
      date: "11月07日",
      shortDate: "11.07",
      timestamp: "2026年11月7日",
      location: "宜宾 · 兴文石海天泉洞",
      elevation: "820m",
      theme: "cavern",
      accent: "#2C7D8C",
      tagline: "地心 · 喀斯特本色",
      entries: [
        {
          caption: "世上溶洞万千，但却相似，看多了被五颜六色彩灯过度渲染的溶洞，来到兴文天泉洞，才看见喀斯特原本的模样，这里钟乳林立，暗河行舟，天光泻入，是大地本身的震撼",
          time: "10:10",
          layout: "journal-note",
          noteTitle: "兴文天泉洞 · 暗河行舟，天光泻入"
        },
        {
          caption: "穿越地心世界",
          time: "14:12",
          layout: "journal-note",
          noteTitle: "奇境穿行 · 地心探秘"
        }
      ]
    },
    {
      id: "ch-1108",
      dayNum: "DAY 11",
      date: "11月08日",
      shortDate: "11.08",
      timestamp: "2026年11月8日",
      location: "大凉山 · 螺髻温泉与大石板古村",
      elevation: "1,560m",
      theme: "terracotta",
      accent: "#D96629",
      tagline: "彝韵 · 橙墙树影与旧时光",
      entries: [
        {
          caption: "藏在大凉山峡谷的秘境，螺髻九十九里温泉瀑布，今日特意来体验了一下，谁懂啊，居然换来了一人包池的快乐，浸在热泉里听瀑布，这才是旅行该有的松弛吧\n至于网上差评的卫生间和更衣室，现在已大大改观，新卫生间在最后一张图片哦",
          time: "12:17",
          layout: "journal-note",
          noteTitle: "螺髻九十九里 · 一人包池听瀑布"
        },
        {
          caption: "六百年的古村落，藏着彝乡温柔\n橙墙树影，古巷人家\n借一身彝装，与旧时光相遇\n找一处小小的院落，打卡特色一鱼三吃，三重快乐，鲜到上头",
          time: "11月8日",
          layout: "editorial-9",
          photos: [
            { src: "assets/photos/11-08/01.jpg", thumb: "assets/thumbs/11-08/01.jpg", orient: "P", alt: "飞檐翘角的大石板灵鹰寺古阁" },
            { src: "assets/photos/11-08/02.jpg", thumb: "assets/thumbs/11-08/02.jpg", orient: "P", alt: "身着彝族盛装倚立雕花木门" },
            { src: "assets/photos/11-08/03.jpg", thumb: "assets/thumbs/11-08/03.jpg", orient: "L", alt: "小院里的特色一鱼三吃美味" },
            { src: "assets/photos/11-08/04.jpg", thumb: "assets/thumbs/11-08/04.jpg", orient: "P", alt: "大石板古村红墙打卡留影" },
            { src: "assets/photos/11-08/05.jpg", thumb: "assets/thumbs/11-08/05.jpg", orient: "P", alt: "斑驳土墙与红灯笼下的温柔侧影" },
            { src: "assets/photos/11-08/06.jpg", thumb: "assets/thumbs/11-08/06.jpg", orient: "P", alt: "轻触古巷三角梅花枝" },
            { src: "assets/photos/11-08/07.jpg", thumb: "assets/thumbs/11-08/07.jpg", orient: "P", alt: "青花瓷壁前的银冠彝乡风华" },
            { src: "assets/photos/11-08/08.jpg", thumb: "assets/thumbs/11-08/08.jpg", orient: "P", alt: "湛蓝天空衬托热烈橙墙" },
            { src: "assets/photos/11-08/09.jpg", thumb: "assets/thumbs/11-08/09.jpg", orient: "P", alt: "茶马古道红拱门里的巧笑倩兮" }
          ]
        }
      ]
    },
    {
      id: "ch-1109",
      dayNum: "DAY 12",
      date: "11月09日",
      shortDate: "11.09",
      timestamp: "2026年11月9日",
      location: "西昌 · 建昌古城与邛海小渔村",
      elevation: "1,510m",
      theme: "lantern-sunset",
      accent: "#E39B3B",
      tagline: "终章 · 灯火古意与邛海圆满",
      entries: [
        {
          caption: "夜入建昌，灯火起，古意生",
          time: "11:14",
          layout: "editorial-6",
          darkBlock: true,
          photos: [
            { src: "assets/photos/11-09-jc/01.jpg", thumb: "assets/thumbs/11-09-jc/01.jpg", orient: "L", alt: "夜色中金碧辉煌的四牌楼" },
            { src: "assets/photos/11-09-jc/02.jpg", thumb: "assets/thumbs/11-09-jc/02.jpg", orient: "L", alt: "灯火通明的建昌城门楼" },
            { src: "assets/photos/11-09-jc/03.jpg", thumb: "assets/thumbs/11-09-jc/03.jpg", orient: "L", alt: "暖光石板街与古巷长影" },
            { src: "assets/photos/11-09-jc/04.jpg", thumb: "assets/thumbs/11-09-jc/04.jpg", orient: "L", alt: "建昌古城牌坊流光溢彩" },
            { src: "assets/photos/11-09-jc/05.jpg", thumb: "assets/thumbs/11-09-jc/05.jpg", orient: "L", alt: "熙攘热闹的古城灯火长街" },
            { src: "assets/photos/11-09-jc/06.jpg", thumb: "assets/thumbs/11-09-jc/06.jpg", orient: "L", alt: "油纸伞与红灯笼织就的古意天幕" }
          ]
        },
        {
          caption: "来西昌，想赴一场星空之约，遗憾没能等来火箭划破天空，那就把这份震撼留给下次再见啦！环湖邛海，看遍邛海碧波，落脚小渔村，品味烟火烧烤，也算圆满😁",
          time: "11月9日",
          layout: "editorial-9",
          photos: [
            { src: "assets/photos/11-09-qh/01.jpg", thumb: "assets/thumbs/11-09-qh/01.jpg", orient: "L", alt: "邛海观景廊下的悠闲小憩" },
            { src: "assets/photos/11-09-qh/02.jpg", thumb: "assets/thumbs/11-09-qh/02.jpg", orient: "L", alt: "白墙绿树庭院前的明朗留影" },
            { src: "assets/photos/11-09-qh/03.jpg", thumb: "assets/thumbs/11-09-qh/03.jpg", orient: "L", alt: "椰影红灯塔与邛海沙滩" },
            { src: "assets/photos/11-09-qh/04.jpg", thumb: "assets/thumbs/11-09-qh/04.jpg", orient: "P", alt: "金色日落洒满邛海与笑颜" },
            { src: "assets/photos/11-09-qh/05.jpg", thumb: "assets/thumbs/11-09-qh/05.jpg", orient: "P", alt: "湖畔微风里的西昌留念" },
            { src: "assets/photos/11-09-qh/06.jpg", thumb: "assets/thumbs/11-09-qh/06.jpg", orient: "P", alt: "碧波树影间轻松惬意" },
            { src: "assets/photos/11-09-qh/07.jpg", thumb: "assets/thumbs/11-09-qh/07.jpg", orient: "L", alt: "小渔村顺路烧烤的人间烟火" },
            { src: "assets/photos/11-09-qh/08.jpg", thumb: "assets/thumbs/11-09-qh/08.jpg", orient: "L", alt: "滋滋飘香的西昌火盆烧烤" },
            { src: "assets/photos/11-09-qh/09.jpg", thumb: "assets/thumbs/11-09-qh/09.jpg", orient: "P", alt: "圆满收官的碳火烧烤盛宴" }
          ]
        }
      ]
    }
  ]
};
