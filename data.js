// 沐辰 2026 川西与西昌十二日山河画卷（10.29 — 11.09）
// 所有游记文案均忠实保留妈妈朋友圈原文

window.SITE_DATA = {
  momName: "老妈",
  wechatName: "沐辰",
  signature: "借时光之手，暖一束花开",
  birthdayDate: "2026.11.25",
  tripRange: "2026.10.29 — 11.09",

  tracks: [
    {
      id: "spring",
      title: "Spring Subway（开往春天的地铁）",
      shortTitle: "Spring Subway",
      artist: "Varlan",
      chapterRange: "开篇 · 10.29 — 10.30",
      bpm: 71,
      beatSec: 0.845,
      slideMs: 3600,
      motionMood: "crisp",
      src: "assets/audio/spring-subway.mp3"
    },
    {
      id: "hometown",
      title: "故郷の原風景（故乡的原风景）",
      shortTitle: "故乡的原风景",
      artist: "宗次郎",
      chapterRange: "高原 · 10.31 — 11.04",
      bpm: 64,
      beatSec: 0.938,
      slideMs: 4200,
      motionMood: "majestic",
      src: "assets/audio/hometown-ocarina.mp3"
    },
    {
      id: "chengdu",
      title: "成都",
      shortTitle: "成都",
      artist: "赵雷",
      chapterRange: "巴蜀 · 11.05 — 11.07",
      bpm: 90,
      beatSec: 0.667,
      slideMs: 3400,
      motionMood: "folk",
      src: "assets/audio/chengdu.mp3"
    },
    {
      id: "sunset",
      title: "SUNSET IN THE LAKE",
      shortTitle: "SUNSET IN THE LAKE",
      artist: "DAISHI DANCE / 姫神",
      chapterRange: "西昌与尾声 · 11.08 — 11.09",
      bpm: 118,
      beatSec: 0.508,
      slideMs: 3200,
      motionMood: "luminous",
      src: "assets/audio/sunset-in-the-lake.mp3"
    }
  ],

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
    "assets/photos/11-04/01.jpg",
    "assets/photos/11-09-qh/04.jpg"
  ],

  coverPhoto: "assets/photos/cover/milk-lake.jpg",

  routeStops: [
    { id: "day-1029", date: "10.29", label: "双桥沟",     elev: 3480, x: 84,  y: 162, chapterId: "ch-1029" },
    { id: "day-1030", date: "10.30", label: "山野偶遇",   elev: 3800, x: 160, y: 136, chapterId: "ch-1030" },
    { id: "day-1031", date: "10.31", label: "稻城亚丁",   elev: 4600, x: 246, y: 52,  chapterId: "ch-1031", peak: true },
    { id: "day-1101", date: "11.01", label: "墨石公园",   elev: 3500, x: 332, y: 146, chapterId: "ch-1101" },
    { id: "day-1102", date: "11.02", label: "姑弄村",     elev: 3700, x: 410, y: 124, chapterId: "ch-1102" },
    { id: "day-1103", date: "11.03", label: "八郎生都",   elev: 4340, x: 490, y: 74,  chapterId: "ch-1103", peak: true },
    { id: "day-1104", date: "11.04", label: "理塘·雅拉",  elev: 4014, x: 574, y: 96,  chapterId: "ch-1104" },
    { id: "day-1105", date: "11.05", label: "康定·泸定",  elev: 1320, x: 658, y: 204, chapterId: "ch-1105" },
    { id: "day-1106", date: "11.06", label: "成都茶馆",   elev: 500,  x: 740, y: 256, chapterId: "ch-1106" },
    { id: "day-1107", date: "11.07", label: "兴文天泉洞", elev: 820,  x: 820, y: 238, chapterId: "ch-1107" },
    { id: "day-1108", date: "11.08", label: "螺髻·大石板",elev: 1560, x: 896, y: 192, chapterId: "ch-1108" },
    { id: "day-1109", date: "11.09", label: "建昌·邛海",  elev: 1510, x: 962, y: 196, chapterId: "ch-1109" }
  ],

  // 12 天连续画卷章节：不同章节采用不同电影陈列形式（reel 轮放 / handscroll 连续画卷 / deck 叠影卡片 / intertitle 过场字幕）
  chapters: [
    {
      id: "ch-1029",
      month: "10",
      day: "29",
      date: "10月29日",
      shortDate: "10.29",
      location: "川西 · 双桥沟",
      shortPlace: "双桥沟",
      elevNum: 3480,
      elevation: "3,480m",
      bgColor: "#1B1A16",
      surfaceTint: "rgba(214, 154, 62, 0.14)",
      accent: "#E3A74A",
      presentation: "reel",
      entries: [
        {
          caption: "雪山配彩林，川西已到了封神的季节",
          time: "23:34",
          mode: "reel",
          transition: "dissolve",
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
      month: "10",
      day: "30",
      date: "10月30日",
      shortDate: "10.30",
      location: "川西高原",
      shortPlace: "山野偶遇",
      elevNum: 3800,
      elevation: "3,800m",
      bgColor: "#1E1F1B",
      surfaceTint: "rgba(176, 152, 92, 0.12)",
      accent: "#CFA95A",
      presentation: "spotlight",
      special: "marmot-cracker",
      entries: [
        {
          caption: "别打了，雪饼我给",
          time: "12:26",
          mode: "spotlight",
          photos: [
            { src: "assets/photos/10-30-vid/still.jpg", thumb: "assets/thumbs/10-30-vid/still.jpg", orient: "L", alt: "石峰前两只土拨鼠认真摔跤" }
          ]
        }
      ]
    },
    {
      id: "ch-1031",
      month: "10",
      day: "31",
      date: "10月31日",
      shortDate: "10.31",
      location: "稻城亚丁 · 牛奶海与五色海",
      shortPlace: "稻城亚丁",
      elevNum: 4600,
      elevation: "4,600m",
      bgColor: "#102029",
      surfaceTint: "rgba(62, 166, 186, 0.16)",
      accent: "#54C0D4",
      badge: "4,600m · 零吸氧登顶",
      presentation: "reel-reverse",
      entries: [
        {
          caption: "世界这本书，我又翻了一页\n有些地方，要走很远才到达\n稻城亚丁⛰️ 7:00出发，20:00到达，辛苦是真的，但到了才知道，那些路都值得\n十月末的稻城，雪山白得发亮，草甸黄得温柔，海子蓝得仿佛刺破了天空\n这就是秋天的童话",
          time: "00:15",
          mode: "note"
        },
        {
          caption: "挑战的是海拔，更是自己，零吸氧登顶👍",
          time: "23:02",
          mode: "reel",
          transition: "wipe",
          photos: [
            { src: "assets/photos/10-31/05.jpg", thumb: "assets/thumbs/10-31/05.jpg", orient: "L", alt: "俯瞰雪山环抱中的牛奶海" },
            { src: "assets/photos/10-31/01.jpg", thumb: "assets/thumbs/10-31/01.jpg", orient: "L", alt: "五色海深邃湛蓝的高原秘境" },
            { src: "assets/photos/10-31/07.jpg", thumb: "assets/thumbs/10-31/07.jpg", orient: "P", alt: "零吸氧登顶牛奶海留念" },
            { src: "assets/photos/10-31/04.jpg", thumb: "assets/thumbs/10-31/04.jpg", orient: "P", alt: "日照金山映照冰川溪流" },
            { src: "assets/photos/10-31/03.jpg", thumb: "assets/thumbs/10-31/03.jpg", orient: "P", alt: "央迈勇雪峰与金色洛绒牛场" },
            { src: "assets/photos/10-31/02.jpg", thumb: "assets/thumbs/10-31/02.jpg", orient: "P", alt: "神山脚下的彩林与藏寺" },
            { src: "assets/photos/10-31/06.jpg", thumb: "assets/thumbs/10-31/06.jpg", orient: "L", alt: "冲古寺秋阳与金树" },
            { src: "assets/photos/10-31/08.jpg", thumb: "assets/thumbs/10-31/08.jpg", orient: "L", alt: "高山海子与漫山红黄草甸" },
            { src: "assets/photos/10-31/09.jpg", thumb: "assets/thumbs/10-31/09.jpg", orient: "P", alt: "面对雪山高举双臂欢呼" }
          ]
        }
      ]
    },
    {
      id: "ch-1101",
      month: "11",
      day: "01",
      date: "11月01日",
      shortDate: "11.01",
      location: "甘孜 · 墨石公园",
      shortPlace: "墨石公园",
      elevNum: 3500,
      elevation: "3,500m",
      bgColor: "#171B21",
      surfaceTint: "rgba(130, 152, 176, 0.14)",
      accent: "#9AB3CC",
      presentation: "handscroll",
      entries: [
        {
          caption: "亿万年的地壳褶皱\n这是川西的暗黑浪漫",
          time: "",
          mode: "handscroll",
          photos: [
            { src: "assets/photos/11-01/01.jpg", thumb: "assets/thumbs/11-01/01.jpg", orient: "P", alt: "阳光刺破糜棱岩石林峰脊" },
            { src: "assets/photos/11-01/02.jpg", thumb: "assets/thumbs/11-01/02.jpg", orient: "L", alt: "幽蓝灰岩间的秋叶与栈道" },
            { src: "assets/photos/11-01/03.jpg", thumb: "assets/thumbs/11-01/03.jpg", orient: "L", alt: "亿万年地质褶皱奇观" },
            { src: "assets/photos/11-01/08.jpg", thumb: "assets/thumbs/11-01/08.jpg", orient: "P", alt: "一袭红衣攀立墨石崖畔" },
            { src: "assets/photos/11-01/04.jpg", thumb: "assets/thumbs/11-01/04.jpg", orient: "L", alt: "蓝天下的异域墨石群峰" },
            { src: "assets/photos/11-01/05.jpg", thumb: "assets/thumbs/11-01/05.jpg", orient: "P", alt: "草坡上呆萌张望的土拨鼠" },
            { src: "assets/photos/11-01/06.jpg", thumb: "assets/thumbs/11-01/06.jpg", orient: "L", alt: "连绵起伏的灰黑石林全景" },
            { src: "assets/photos/11-01/07.jpg", thumb: "assets/thumbs/11-01/07.jpg", orient: "P", alt: "318 路标与宇航员打卡" },
            { src: "assets/photos/11-01/09.jpg", thumb: "assets/thumbs/11-01/09.jpg", orient: "L", alt: "冷峻深邃的墨石沟壑" }
          ]
        }
      ]
    },
    {
      id: "ch-1102",
      month: "11",
      day: "02",
      date: "11月02日",
      shortDate: "11.02",
      location: "塔公 · 姑弄村",
      shortPlace: "姑弄村",
      elevNum: 3700,
      elevation: "3,700m",
      bgColor: "#211C15",
      surfaceTint: "rgba(206, 158, 86, 0.13)",
      accent: "#DBA95A",
      presentation: "intertitle",
      entries: [
        {
          caption: "来姑弄村，浪费一个下午",
          time: "17:13",
          mode: "intertitle"
        }
      ]
    },
    {
      id: "ch-1103",
      month: "11",
      day: "03",
      date: "11月03日",
      shortDate: "11.03",
      location: "八郎生都",
      shortPlace: "八郎生都",
      elevNum: 4340,
      elevation: "4,340m",
      bgColor: "#111C2D",
      surfaceTint: "rgba(84, 146, 224, 0.16)",
      accent: "#6EA9EC",
      presentation: "reel",
      entries: [
        {
          caption: "八郎生都\n拥有360°雪山环绕的浪漫",
          time: "",
          mode: "reel",
          transition: "dissolve",
          photos: [
            { src: "assets/photos/11-03/01.jpg", thumb: "assets/thumbs/11-03/01.jpg", orient: "L", alt: "夕阳余晖洒满巍峨雪峰" },
            { src: "assets/photos/11-03/05.jpg", thumb: "assets/thumbs/11-03/05.jpg", orient: "P", alt: "漫天经幡天幕下的飒爽身影" },
            { src: "assets/photos/11-03/06.jpg", thumb: "assets/thumbs/11-03/06.jpg", orient: "L", alt: "雪山背景前的木架秋千" },
            { src: "assets/photos/11-03/07.jpg", thumb: "assets/thumbs/11-03/07.jpg", orient: "L", alt: "镜面水台与雪山云端起舞" },
            { src: "assets/photos/11-03/02.jpg", thumb: "assets/thumbs/11-03/02.jpg", orient: "P", alt: "湛蓝苍穹下的侧颜留影" },
            { src: "assets/photos/11-03/04.jpg", thumb: "assets/thumbs/11-03/04.jpg", orient: "L", alt: "风中祈福的五彩玛尼堆" },
            { src: "assets/photos/11-03/08.jpg", thumb: "assets/thumbs/11-03/08.jpg", orient: "L", alt: "八郎生都 Balang Sumdho" },
            { src: "assets/photos/11-03/03.jpg", thumb: "assets/thumbs/11-03/03.jpg", orient: "P", alt: "高原地标石碑与无垠晴空" },
            { src: "assets/photos/11-03/09.jpg", thumb: "assets/thumbs/11-03/09.jpg", orient: "L", alt: "一排静谧庄严的高原白塔" }
          ]
        }
      ]
    },
    {
      id: "ch-1104",
      month: "11",
      day: "04",
      date: "11月04日",
      shortDate: "11.04",
      location: "理塘 · 雅拉雪山",
      shortPlace: "理塘·雅拉",
      elevNum: 4014,
      elevation: "4,014m",
      bgColor: "#1D1719",
      surfaceTint: "rgba(218, 102, 66, 0.16)",
      accent: "#E87A54",
      presentation: "reel-reverse",
      entries: [
        {
          caption: "爬上东山顶，看长青春科尔寺静立，看千户藏寨藏着人间烟火，来仁康古街追寻旧时光，风中有酥油的香气，耳边有缓缓转动的经筒声，这就是世界高城 -- 理塘",
          time: "10:11",
          mode: "note"
        },
        {
          caption: "不爱城市霓虹喧嚣，也不恋远方异国。心之所向唯有高原旷野，这里氧气稀薄，信仰却足够厚重。当双脚抵达，心底那股感动，难以言喻。前路尚有无数山河未曾相逢，慢慢走，此生一一抵达。\n2026年秋于雅（亚）拉雪山",
          time: "",
          mode: "reel",
          transition: "wipe",
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
      month: "11",
      day: "05",
      date: "11月05日",
      shortDate: "11.05",
      location: "康定 · 泸定桥",
      shortPlace: "康定·泸定",
      elevNum: 1320,
      elevation: "1,320m",
      bgColor: "#221916",
      surfaceTint: "rgba(196, 98, 72, 0.14)",
      accent: "#DF7F62",
      presentation: "intertitle",
      entries: [
        {
          caption: "折多河穿城奔流，群山环抱着情歌故里，康定到此一遇，体会那句跑马溜溜的浪漫",
          time: "11:54",
          mode: "intertitle",
          placeTag: "康定"
        },
        {
          caption: "终于来到课本里的泸定桥啦\n踏泸定铁索，风摇桥晃，铁索凌空，心中肃然，手更不敢松，生怕手机奔赴大渡河",
          time: "16:53",
          mode: "intertitle",
          placeTag: "泸定桥"
        }
      ]
    },
    {
      id: "ch-1106",
      month: "11",
      day: "06",
      date: "11月06日",
      shortDate: "11.06",
      location: "成都老茶馆",
      shortPlace: "成都茶馆",
      elevNum: 500,
      elevation: "500m",
      bgColor: "#231515",
      surfaceTint: "rgba(202, 74, 62, 0.16)",
      accent: "#E3685B",
      presentation: "deck",
      entries: [
        {
          caption: "答案在路上，自由在风里\n一路高歌一路嗨",
          time: "09:57",
          mode: "note"
        },
        {
          caption: "来成都老茶馆，点一盏好茶、得半日清闲，听旁人摆龙门阵，看台上脸谱变换，慢慢悠悠，任时光慢慢流走",
          time: "14:55",
          mode: "deck",
          photos: [
            { src: "assets/photos/11-06/01.jpg", thumb: "assets/thumbs/11-06/01.jpg", orient: "L", alt: "高朋满座的成都老茶馆中庭" },
            { src: "assets/photos/11-06/04.jpg", thumb: "assets/thumbs/11-06/04.jpg", orient: "L", alt: "盖碗清茶配花生瓜子" },
            { src: "assets/photos/11-06/05.jpg", thumb: "assets/thumbs/11-06/05.jpg", orient: "L", alt: "红毯台阶上自在小憩" },
            { src: "assets/photos/11-06/02.jpg", thumb: "assets/thumbs/11-06/02.jpg", orient: "P", alt: "朱红长阶上的茶艺表演" },
            { src: "assets/photos/11-06/06.jpg", thumb: "assets/thumbs/11-06/06.jpg", orient: "P", alt: "川剧变脸绝活" },
            { src: "assets/photos/11-06/03.jpg", thumb: "assets/thumbs/11-06/03.jpg", orient: "P", alt: "人声鼎沸的巴蜀茶席" }
          ]
        }
      ]
    },
    {
      id: "ch-1107",
      month: "11",
      day: "07",
      date: "11月07日",
      shortDate: "11.07",
      location: "宜宾 · 兴文天泉洞",
      shortPlace: "兴文天泉洞",
      elevNum: 820,
      elevation: "820m",
      bgColor: "#102026",
      surfaceTint: "rgba(56, 152, 168, 0.16)",
      accent: "#53B5C5",
      presentation: "intertitle",
      entries: [
        {
          caption: "世上溶洞万千，但却相似，看多了被五颜六色彩灯过度渲染的溶洞，来到兴文天泉洞，才看见喀斯特原本的模样，这里钟乳林立，暗河行舟，天光泻入，是大地本身的震撼",
          time: "10:10",
          mode: "intertitle",
          placeTag: "天泉洞"
        },
        {
          caption: "穿越地心世界",
          time: "14:12",
          mode: "intertitle",
          placeTag: "地心通道"
        }
      ]
    },
    {
      id: "ch-1108",
      month: "11",
      day: "08",
      date: "11月08日",
      shortDate: "11.08",
      location: "大凉山 · 螺髻温泉与大石板古村",
      shortPlace: "螺髻·大石板",
      elevNum: 1560,
      elevation: "1,560m",
      bgColor: "#241712",
      surfaceTint: "rgba(224, 114, 52, 0.16)",
      accent: "#EE8A49",
      presentation: "handscroll",
      entries: [
        {
          caption: "藏在大凉山峡谷的秘境，螺髻九十九里温泉瀑布，今日特意来体验了一下，谁懂啊，居然换来了一人包池的快乐，浸在热泉里听瀑布，这才是旅行该有的松弛吧\n至于网上差评的卫生间和更衣室，现在已大大改观，新卫生间在最后一张图片哦",
          time: "12:17",
          mode: "note"
        },
        {
          caption: "六百年的古村落，藏着彝乡温柔\n橙墙树影，古巷人家\n借一身彝装，与旧时光相遇\n找一处小小的院落，打卡特色一鱼三吃，三重快乐，鲜到上头",
          time: "",
          mode: "handscroll",
          photos: [
            { src: "assets/photos/11-08/01.jpg", thumb: "assets/thumbs/11-08/01.jpg", orient: "P", alt: "飞檐翘角的大石板古阁" },
            { src: "assets/photos/11-08/02.jpg", thumb: "assets/thumbs/11-08/02.jpg", orient: "P", alt: "身着彝族盛装倚立雕花木门" },
            { src: "assets/photos/11-08/04.jpg", thumb: "assets/thumbs/11-08/04.jpg", orient: "P", alt: "大石板古村红墙留影" },
            { src: "assets/photos/11-08/05.jpg", thumb: "assets/thumbs/11-08/05.jpg", orient: "P", alt: "斑驳土墙与红灯笼下的侧影" },
            { src: "assets/photos/11-08/06.jpg", thumb: "assets/thumbs/11-08/06.jpg", orient: "P", alt: "古巷三角梅花影" },
            { src: "assets/photos/11-08/07.jpg", thumb: "assets/thumbs/11-08/07.jpg", orient: "P", alt: "青花瓷壁前的彝乡银饰" },
            { src: "assets/photos/11-08/03.jpg", thumb: "assets/thumbs/11-08/03.jpg", orient: "L", alt: "小院里的特色一鱼三吃" },
            { src: "assets/photos/11-08/08.jpg", thumb: "assets/thumbs/11-08/08.jpg", orient: "P", alt: "湛蓝晴空衬托橙墙" },
            { src: "assets/photos/11-08/09.jpg", thumb: "assets/thumbs/11-08/09.jpg", orient: "P", alt: "茶马古道红拱门留影" }
          ]
        }
      ]
    },
    {
      id: "ch-1109",
      month: "11",
      day: "09",
      date: "11月09日",
      shortDate: "11.09",
      location: "西昌 · 建昌古城与邛海",
      shortPlace: "建昌·邛海",
      elevNum: 1510,
      elevation: "1,510m",
      bgColor: "#1B1615",
      surfaceTint: "rgba(232, 166, 68, 0.16)",
      accent: "#F0B654",
      presentation: "reel",
      entries: [
        {
          caption: "夜入建昌，灯火起，古意生",
          time: "11:14",
          mode: "reel",
          transition: "dissolve",
          subTitle: "建昌古城 · 夜色",
          photos: [
            { src: "assets/photos/11-09-jc/01.jpg", thumb: "assets/thumbs/11-09-jc/01.jpg", orient: "L", alt: "夜色中金碧辉煌的四牌楼" },
            { src: "assets/photos/11-09-jc/02.jpg", thumb: "assets/thumbs/11-09-jc/02.jpg", orient: "L", alt: "灯火通明的建昌城门楼" },
            { src: "assets/photos/11-09-jc/03.jpg", thumb: "assets/thumbs/11-09-jc/03.jpg", orient: "L", alt: "暖光石板街与古巷长影" },
            { src: "assets/photos/11-09-jc/04.jpg", thumb: "assets/thumbs/11-09-jc/04.jpg", orient: "L", alt: "建昌古城牌坊流光溢彩" },
            { src: "assets/photos/11-09-jc/05.jpg", thumb: "assets/thumbs/11-09-jc/05.jpg", orient: "L", alt: "熙攘热闹的古城灯火长街" },
            { src: "assets/photos/11-09-jc/06.jpg", thumb: "assets/thumbs/11-09-jc/06.jpg", orient: "L", alt: "油纸伞与红灯笼天幕" }
          ]
        },
        {
          caption: "来西昌，想赴一场星空之约，遗憾没能等来火箭划破天空，那就把这份震撼留给下次再见啦！环湖邛海，看遍邛海碧波，落脚小渔村，品味烟火烧烤，也算圆满😁",
          time: "",
          mode: "reel",
          transition: "wipe",
          subTitle: "邛海 · 小渔村",
          photos: [
            { src: "assets/photos/11-09-qh/04.jpg", thumb: "assets/thumbs/11-09-qh/04.jpg", orient: "P", alt: "金色日落洒满邛海与笑颜" },
            { src: "assets/photos/11-09-qh/01.jpg", thumb: "assets/thumbs/11-09-qh/01.jpg", orient: "L", alt: "邛海观景廊下的悠闲小憩" },
            { src: "assets/photos/11-09-qh/03.jpg", thumb: "assets/thumbs/11-09-qh/03.jpg", orient: "L", alt: "椰影红灯塔与邛海沙滩" },
            { src: "assets/photos/11-09-qh/05.jpg", thumb: "assets/thumbs/11-09-qh/05.jpg", orient: "P", alt: "湖畔微风里的西昌留念" },
            { src: "assets/photos/11-09-qh/06.jpg", thumb: "assets/thumbs/11-09-qh/06.jpg", orient: "P", alt: "碧波树影间轻松惬意" },
            { src: "assets/photos/11-09-qh/02.jpg", thumb: "assets/thumbs/11-09-qh/02.jpg", orient: "L", alt: "白墙绿树庭院前的明朗留影" },
            { src: "assets/photos/11-09-qh/07.jpg", thumb: "assets/thumbs/11-09-qh/07.jpg", orient: "L", alt: "小渔村顺路烧烤的人间烟火" },
            { src: "assets/photos/11-09-qh/08.jpg", thumb: "assets/thumbs/11-09-qh/08.jpg", orient: "L", alt: "滋滋飘香的西昌火盆烧烤" },
            { src: "assets/photos/11-09-qh/09.jpg", thumb: "assets/thumbs/11-09-qh/09.jpg", orient: "P", alt: "圆满收官的碳火烧烤盛宴" }
          ]
        }
      ]
    }
  ]
};
