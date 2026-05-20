<template>
  <!-- 背景模糊遮罩 -->
  <Transition name="fade">
    <div v-show="store.menuOpenState && !screenSaverVisible && !store.backgroundShow" class="menu-overlay" @click="closeMenu"></div>
  </Transition>
  <div class="top-menu-container" v-show="!screenSaverVisible && !store.backgroundShow">
    <div
      class="menu-trigger"
      v-show="isMobile || arrowVisible || store.menuOpenState"
      @click="toggleMenu"
      :class="{ active: store.menuOpenState }"
    >
      <ArrowDown v-if="!store.menuOpenState" theme="filled" size="24" fill="#ffffff" />
      <ArrowUp v-else theme="filled" size="24" fill="#ffffff" />
    </div>
    <Transition name="slide-down">
      <div v-show="store.menuOpenState" class="menu-content cards" @click.stop>
        <div class="menu-left">
          <div class="time-row">
            <span class="hour">{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
          </div>
          <div class="date-row">
            <span>{{ currentTime.year }}-{{ currentTime.month }}-{{ currentTime.day }} {{ currentTime.weekday }}</span>
          </div>
          <div class="weather-row">
            <Weather :mini="true" />
          </div>
        </div>
        <div class="menu-center">
          <Hitokoto :mini="true" />
        </div>
        <div class="menu-right">
          <div class="quick-links">
            <a
              v-for="item in topLinks"
              :key="item.name"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              <Icon size="18">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { getCurrentTime } from '@/utils/getTime';
import Hitokoto from './Hitokoto.vue';
import Weather from './Weather.vue';
import { Icon } from '@vicons/utils';
import { ArrowDown, ArrowUp } from '@icon-park/vue-next';
import { Blog, Cloud, CompactDisc, Compass, Book, Fire, LaptopCode } from '@vicons/fa';
import siteLinks from '@/assets/siteLinks.json';
import { mainStore } from '@/store';

const store = mainStore();

const props = defineProps({
  screenSaverVisible: {
    type: Boolean,
    default: false
  }
});

const arrowVisible = ref(false);
const currentTime = ref({});
const isMobile = ref(false);
let timeInterval = null;

const topLinks = computed(() => siteLinks.slice(0, 4));

const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
};

const toggleMenu = (e) => {
  e.stopPropagation();
  store.menuOpenState = !store.menuOpenState;
};

const closeMenu = () => {
  store.menuOpenState = false;
};

const handleClickOutside = (e) => {
  // 有遮罩层后，这个主要用于处理其他边缘情况
  if (store.menuOpenState && !e.target.closest('.top-menu-container') && !e.target.classList.contains('menu-overlay')) {
    closeMenu();
  }
};

const handleMouseMove = (e) => {
  if (!isMobile.value && !props.screenSaverVisible && !store.backgroundShow) {
    const threshold = 50;
    arrowVisible.value = e.clientY <= threshold;
  } else {
    arrowVisible.value = false;
  }
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && store.menuOpenState) {
    closeMenu();
  }
};

const updateTime = () => {
  currentTime.value = getCurrentTime();
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 1024;
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', checkMobile);
  document.addEventListener('keydown', handleKeyDown);
  checkMobile();
});

onBeforeUnmount(() => {
  clearInterval(timeInterval);
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="scss" scoped>
// 背景模糊遮罩
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 290;
  pointer-events: auto;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.top-menu-container {
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 300;
  pointer-events: none;

  .menu-trigger {
    pointer-events: auto;
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s, background 0.3s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: scale(1.1);
      background: rgba(0, 0, 0, 0.6);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}

.menu-content {
  pointer-events: auto;
  margin-top: 10px;
  width: 90%;
  max-width: 1100px;
  padding: 20px 28px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  color: #fff;

  .menu-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .time-row {
      .hour {
        font-family: 'UnidreamLED', monospace;
        font-size: 2rem;
        font-weight: bold;
      }
    }

    .date-row {
      font-size: 1rem;
      opacity: 0.85;
    }

    .weather-row {
      font-size: 0.9rem;
      margin-top: 4px;
    }
  }

  .menu-center {
    flex: 2;
    display: flex;
    justify-content: center;

    :deep(.hitokoto) {
      text-align: center;
      .content .text {
        font-size: 1rem;
        -webkit-line-clamp: 2;
      }
      .content .from {
        font-size: 0.9rem;
      }
    }
  }

  .menu-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .quick-links {
      display: flex;
      flex-direction: column;
      gap: 10px;

      a {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        text-decoration: none;
        font-size: 0.85rem;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        transition: all 0.2s;
        white-space: nowrap;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
      }
    }
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .menu-left,
    .menu-center,
    .menu-right {
      width: 100%;
      justify-content: center;
      text-align: center;
    }

    .menu-left {
      align-items: center;
      gap: 4px;

      .time-row .hour {
        font-size: 1.3rem;
      }

      .date-row {
        font-size: 0.85rem;
      }
    }

    .menu-right .quick-links {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
  }

  @media (max-width: 720px) {
    padding: 16px 15px;
    width: 95%;
    border-radius: 20px;

    .menu-left {
      .time-row .hour {
        font-size: 1.2rem;
      }

      .date-row {
        font-size: 0.8rem;
      }
    }

    .menu-center :deep(.hitokoto) {
      .content .text {
        font-size: 0.9rem;
      }
    }

    .menu-right .quick-links {
      gap: 8px;

      a {
        font-size: 0.8rem;
        padding: 5px 10px;
      }
    }
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>