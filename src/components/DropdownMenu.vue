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

    <!-- 覆盖层菜单（全屏） -->
    <Transition name="slide-down">
      <div v-show="menuVisible" class="menu-overlay" @click.self="closeMenu">
        <div class="menu-content cards">
          <div class="menu-left">
            <Hitokoto :mini="true" />
            <Weather :mini="true" />
          </div>
          <div class="menu-right">
            <div class="time">
              <span class="hour">{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
              <span class="date">{{ currentTime.year }}-{{ currentTime.month }}-{{ currentTime.day }} {{ currentTime.weekday }}</span>
            </div>
            <div class="quick-links">
              <a
                v-for="item in topLinks"
                :key="item.name"
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size="18">
                  <component :is="siteIcon[item.icon]" />
                </Icon>
                <span>{{ item.name }}</span>
              </a>
            </div>
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
const isMobile = ref(false);
let timeInterval = null;

// 切换菜单显示
const toggleMenu = (e) => {
  e.stopPropagation();
  menuVisible.value = !menuVisible.value;
};

// 关闭菜单
const closeMenu = () => {
  menuVisible.value = false;
};

// 点击外部关闭菜单（实际上由覆盖层处理，但为了安全也可保留）
const handleClickOutside = (e) => {
  if (menuVisible.value && !e.target.closest('.top-menu-container')) {
    closeMenu();
  }
};

// 监听鼠标移动，靠近顶部时显示箭头（仅PC）
const handleMouseMove = (e) => {
  if (!isMobile.value) {
    const threshold = 50;
    arrowVisible.value = e.clientY <= threshold;
  } else {
    arrowVisible.value = false;
  }
};

// 按 ESC 键关闭菜单
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && menuVisible.value) {
    closeMenu();
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

// 图标映射
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
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

  /* 覆盖层样式 */
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    z-index: 400; /* 高于箭头 */

    .menu-content {
      width: 90%;
      max-width: 1000px;
      padding: 40px;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

      .menu-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .menu-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 20px;

        .time {
          font-family: 'UnidreamLED', monospace;
          text-align: right;

          .hour {
            font-size: 2rem;
            display: block;
          }

          .date {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 5px;
          }
        }

        .quick-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: flex-end;

          a {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #fff;
            text-decoration: none;
            font-size: 1rem;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            transition: 0.2s;

            &:hover {
              background: rgba(255, 255, 255, 0.2);
              transform: scale(1.05);
            }

            .i-icon {
              display: flex;
            }
          }
        }
      }

      /* 移动端适配 */
      @media (max-width: 720px) {
        flex-direction: column;
        padding: 30px 20px;
        gap: 30px;

        .menu-left {
          width: 100%;
        }

        .menu-right {
          width: 100%;
          align-items: center;

          .time {
            text-align: center;

            .hour {
              font-size: 1.8rem;
            }
          }

          .quick-links {
            justify-content: center;
          }
        }
      }
    }
  }
}

/* 滑入动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>