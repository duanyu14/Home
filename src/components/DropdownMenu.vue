<template>
  <div class="top-menu-container" v-show="!screenSaverVisible">
    <!-- 箭头触发器：移动端始终显示，PC端靠近顶部时显示 -->
    <div
      class="menu-trigger"
      v-show="isMobile || arrowVisible || menuVisible"
      @click="toggleMenu"
      :class="{ active: menuVisible }"
    >
      <ArrowDown v-if="!menuVisible" theme="filled" size="24" fill="#ffffff" />
      <ArrowUp v-else theme="filled" size="24" fill="#ffffff" />
    </div>

    <!-- 下拉菜单内容（带滑入动画） -->
    <Transition name="slide-down">
      <div v-show="menuVisible" class="menu-content cards">
        <div class="menu-left">
          <Hitokoto :mini="true" />
          <Weather :mini="true" />
        </div>
        <div class="menu-right">
          <div class="time">
            <span>{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
            <span class="date">{{ currentTime.year }}-{{ currentTime.month }}-{{ currentTime.day }} {{ currentTime.weekday }}</span>
          </div>
          <div class="quick-links">
            <a v-for="item in topLinks" :key="item.name" :href="item.link" target="_blank">
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

const props = defineProps({
  screenSaverVisible: {
    type: Boolean,
    default: false
  }
});

const menuVisible = ref(false);
const arrowVisible = ref(false);
const currentTime = ref({});
const isMobile = ref(false); // 是否移动端（<=720px）
let timeInterval = null;

// 切换菜单显示
const toggleMenu = (e) => {
  e.stopPropagation();
  menuVisible.value = !menuVisible.value;
};

// 点击外部关闭菜单
const handleClickOutside = (e) => {
  if (menuVisible.value && !e.target.closest('.top-menu-container')) {
    menuVisible.value = false;
  }
};

// 监听鼠标移动，靠近顶部时显示箭头（仅PC）
const handleMouseMove = (e) => {
  if (!isMobile.value) {
    const threshold = 50;
    arrowVisible.value = e.clientY <= threshold;
  } else {
    arrowVisible.value = false; // 移动端不用此逻辑
  }
};

// 更新时间
const updateTime = () => {
  currentTime.value = getCurrentTime();
};

// 检测屏幕宽度
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 720;
};

// 取前4个站点作为快捷链接
const topLinks = computed(() => siteLinks.slice(0, 4));

// 图标映射（与 Links.vue 保持一致）
const siteIcon = {
  Blog, Cloud, CompactDisc, Compass, Book, Fire, LaptopCode,
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', checkMobile);
  checkMobile(); // 初始化
});

onBeforeUnmount(() => {
  clearInterval(timeInterval);
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', checkMobile);
});
</script>

<style lang="scss" scoped>
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
    opacity: 1;
    visibility: visible;

    &:hover {
      transform: scale(1.1);
      background: rgba(0, 0, 0, 0.6);
    }
    &:active {
      transform: scale(0.95);
    }

    @media (max-width: 720px) {
      width: 56px;
      height: 56px;
    }
  }

  .menu-content {
    pointer-events: auto;
    margin-top: 10px;
    width: 90%;
    max-width: 1200px;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    .menu-left {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .menu-right {
      display: flex;
      gap: 30px;
      align-items: center;

      .time {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-family: 'UnidreamLED', monospace;
        .date {
          font-size: 0.8rem;
          opacity: 0.8;
        }
      }

      .quick-links {
        display: flex;
        gap: 16px;
        a {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #fff;
          text-decoration: none;
          font-size: 0.9rem;
          transition: 0.2s;
          &:hover {
            color: #57a3ff;
            transform: scale(1.05);
          }
          .i-icon {
            display: flex;
          }
        }
      }
    }

    // 移动端适配
    @media (max-width: 720px) {
      flex-direction: column;
      align-items: stretch;
      padding: 16px;
      width: 95%;
      border-radius: 20px;

      .menu-left {
        justify-content: center;
        margin-bottom: 12px;
      }

      .menu-right {
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .time {
          align-items: center;
          .date {
            font-size: 0.9rem;
          }
        }

        .quick-links {
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 8px;
          a {
            font-size: 1rem;
            span {
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
}

/* 下拉动画 */
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