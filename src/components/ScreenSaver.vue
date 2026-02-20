<template>
  <Transition name="fade">
    <div v-if="visible" class="screen-saver" @click="emit('click')">
      <div class="overlay"></div>
      <div class="content">
        <div class="time">
          <span class="hour">{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
          <span class="date">{{ currentTime.year }}-{{ currentTime.month }}-{{ currentTime.day }} {{ currentTime.weekday }}</span>
        </div>
        <div class="info">
          <Hitokoto :mini="true" />
          <Weather :mini="true" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getCurrentTime } from '@/utils/getTime';
import Hitokoto from './Hitokoto.vue';
import Weather from './Weather.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const currentTime = ref({});
let timeInterval = null;

const updateTime = () => {
  currentTime.value = getCurrentTime();
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval);
});
</script>

<style lang="scss" scoped>
.screen-saver {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200; // 低于菜单（300），高于主内容
  cursor: pointer; // 提示可点击退出

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7); // 半透明黑色，使壁纸变暗
    backdrop-filter: blur(5px); // 可选，增加模糊感
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    pointer-events: none; // 让点击事件穿透到父级的 @click

    .time {
      text-align: center;
      margin-bottom: 30px;
      .hour {
        font-size: 5rem;
        font-family: 'UnidreamLED', monospace;
        line-height: 1.2;
      }
      .date {
        font-size: 1.5rem;
        opacity: 0.8;
      }
    }

    .info {
      display: flex;
      gap: 30px;
      font-size: 1.5rem;
      :deep(.hitokoto.mini),
      :deep(.weather.mini) {
        font-size: 1.2rem;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>