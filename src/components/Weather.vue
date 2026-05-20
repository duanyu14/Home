<template>
  <div class="weather" :class="{ mini }" v-if="hasWeatherData">
    <span>{{ store.weatherData.adCode.city }}&nbsp;</span>
    <span>{{ store.weatherData.weather.weather }}&nbsp;</span>
    <span>{{ store.weatherData.weather.temperature }}℃</span>
    <span v-if="!mini" class="sm-hidden">
      &nbsp;{{ store.weatherData.weather.winddirection }}&nbsp;{{ store.weatherData.weather.windpower }}级
    </span>
    <span v-if="mini" class="mini-wind">
      &nbsp;{{ store.weatherData.weather.winddirection }} {{ store.weatherData.weather.windpower }}级
    </span>
  </div>
  <div class="weather" :class="{ mini }" v-else>
    <span>获取失败</span>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { getAdcode, getWeather, getOtherWeather } from "@/api";
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";

const props = defineProps({
  mini: {
    type: Boolean,
    default: false
  }
});

const store = mainStore();

const mainKey = import.meta.env.VITE_WEATHER_KEY;

const hasWeatherData = computed(() => {
  return store.weatherData.adCode.city && store.weatherData.weather.weather;
});

const getTemperature = (min, max) => {
  try {
    const average = (Number(min) + Number(max)) / 2;
    return Math.round(average);
  } catch (error) {
    console.error("计算温度出现错误：", error);
    return "NaN";
  }
};

const getWeatherData = async () => {
  try {
    if (!mainKey) {
      console.log("未配置，使用备用天气接口");
      const result = await getOtherWeather();
      const data = result.result;
      const weatherData = {
        adCode: {
          city: data.city.City || "未知地区",
        },
        weather: {
          weather: data.condition.day_weather,
          temperature: getTemperature(data.condition.min_degree, data.condition.max_degree),
          winddirection: data.condition.day_wind_direction,
          windpower: data.condition.day_wind_power,
        },
      };
      store.setWeatherData(weatherData);
    } else {
      const adCode = await getAdcode(mainKey);
      if (adCode.infocode !== "10000") {
        throw "地区查询失败";
      }
      const weatherData = {
        adCode: {
          city: adCode.city,
          adcode: adCode.adcode,
        },
        weather: {
          weather: null,
          temperature: null,
          winddirection: null,
          windpower: null,
        },
      };
      const result = await getWeather(mainKey, weatherData.adCode.adcode);
      weatherData.weather = {
        weather: result.lives[0].weather,
        temperature: result.lives[0].temperature,
        winddirection: result.lives[0].winddirection,
        windpower: result.lives[0].windpower,
      };
      store.setWeatherData(weatherData);
    }
  } catch (error) {
    console.error("天气信息获取失败:" + error);
    onError("天气信息获取失败");
  }
};

const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  if (!store.weatherLoaded) {
    if (!store.getCachedWeather()) {
      getWeatherData();
    }
  }
});
</script>

<style lang="scss" scoped>
.weather {
  display: inline-block;
}

.weather.mini {
  display: inline-block;
  font-size: 0.9rem;
  span {
    white-space: nowrap;
  }
  .mini-wind {
    font-size: 0.8rem;
    opacity: 0.8;
  }
}
</style>