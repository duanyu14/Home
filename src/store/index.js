import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      imgLoadStatus: false, // 壁纸加载状态
      innerWidth: null, // 当前窗口宽度
      coverType: "0", // 壁纸种类
      siteStartShow: false, // 建站日期显示
      backgroundShow: false, // 壁纸展示状态
      boxOpenState: false, // 盒子开启状态
      mobileOpenState: false, // 移动端开启状态
      mobileFuncState: false, // 移动端功能区开启状态
      menuOpenState: false, // 下拉菜单开启状态
      setOpenState: false, // 设置页面开启状态
      footerBlur: true, // 底栏模糊
      // 天气数据（共享）
      weatherData: {
        adCode: {
          city: null,
          adcode: null,
        },
        weather: {
          weather: null,
          temperature: null,
          winddirection: null,
          windpower: null,
        },
      },
      weatherLoaded: false, // 天气是否已加载
      // 一言数据（共享）
      hitokotoData: {
        text: "这里应该显示一句话",
        from: "烟雨烟中客",
      },
      hitokotoLoaded: false, // 一言是否已加载
    };
  },
  getters: {
    // 获取页面宽度
    getInnerWidth(state) {
      return state.innerWidth;
    },
  },
  actions: {
    // 更改当前页面宽度
    setInnerWidth(value) {
      this.innerWidth = value;
      if (value >= 720) {
        this.mobileOpenState = false;
        this.mobileFuncState = false;
      }
    },
    // 更改壁纸加载状态
    setImgLoadStatus(value) {
      this.imgLoadStatus = value;
    },
    // 设置天气数据
    setWeatherData(data) {
      this.weatherData = data;
      this.weatherLoaded = true;
      // 同时缓存到 localStorage
      localStorage.setItem('lastWeatherData', JSON.stringify({ data: data.weather, city: data.adCode.city }));
    },
    // 获取缓存的天气数据
    getCachedWeather() {
      const cached = JSON.parse(localStorage.getItem('lastWeatherData'));
      if (cached) {
        this.weatherData = {
          adCode: { city: cached.city, adcode: null },
          weather: cached.data
        };
        this.weatherLoaded = true;
        return true;
      }
      return false;
    },
    // 设置一言数据
    setHitokotoData(data) {
      this.hitokotoData = data;
      this.hitokotoLoaded = true;
    },
  },
  persist: {
    key: "data",
    storage: window.localStorage,
    paths: [
      "coverType",
      "siteStartShow",
      "footerBlur",
      // 移除所有音乐相关的持久化路径
    ],
  },
});