<template>
  <Transition name="fade">
    <div v-if="visible" class="screen-saver" @click="emit('click')">
      <div class="overlay"></div>
      <div class="content">
        <!-- 移动端/平板端布局 -->
        <div class="mobile-layout">
          <div class="time">
            <span class="hour">{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
            <span class="date">{{ currentTime.year }}-{{ currentTime.month }}-{{ currentTime.day }} {{ currentTime.weekday }}</span>
          </div>
          <div class="hitokoto">
            <Hitokoto :mini="true" />
          </div>
          <div class="weather">
            <Weather :mini="true" />
          </div>
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
  z-index: 200;
  cursor: pointer;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    pointer-events: none;

    /* 移动端/平板端/桌面端统一布局：垂直排列 */
    .mobile-layout {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 25px;
      padding: 20px;
      max-width: 90%;
      text-align: center;

      .time {
        text-align: center;

        .hour {
          font-size: 4rem;
          font-family: 'UnidreamLED', monospace;
          display: block;
          line-height: 1.2;
        }

        .date {
          font-size: 1.3rem;
          opacity: 0.8;
          margin-top: 10px;
        }
      }

      .hitokoto {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
      }

      .weather {
        font-size: 1.2rem;
      }
    }
  }

  /* 平板端适配（721px - 1024px） */
  @media (min-width: 721px) and (max-width: 1024px) {
    .content {
      .mobile-layout {
        gap: 22px;

        .time {
          .hour {
            font-size: 3.8rem;
          }

          .date {
            font-size: 1.2rem;
          }
        }

        .hitokoto {
          font-size: 1.15rem;
        }

        .weather {
          font-size: 1.15rem;
        }
      }
    }
  }

  /* 移动端适配（<= 720px） */
  @media (max-width: 720px) {
    .content {
      .mobile-layout {
        gap: 18px;

        .time {
          .hour {
            font-size: 3rem;
          }

          .date {
            font-size: 1rem;
          }
        }

        .hitokoto {
          font-size: 1rem;
          max-width: 90%;
        }

        .weather {
          font-size: 1rem;
        }
      }
    }
  }

  /* 小屏幕手机（<= 390px） */
  @media (max-width: 390px) {
    .content {
      .mobile-layout {
        gap: 15px;

        .time {
          .hour {
            font-size: 2.5rem;
          }

          .date {
            font-size: 0.9rem;
          }
        }

        .hitokoto {
          font-size: 0.95rem;
        }

        .weather {
          font-size: 0.95rem;
        }
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