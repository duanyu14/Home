<template>
  <div
    class="hitokoto cards"
    @click="updateHitokoto"
  >
    <!-- 移除打开音乐面板的按钮和相关逻辑 -->
    <!-- 一言内容 -->
    <Transition name="el-fade-in-linear" mode="out-in">
      <div :key="hitokotoData.text" class="content">
        <span class="text">{{ hitokotoData.text }}</span>
        <span class="from">-「&nbsp;{{ hitokotoData.from }}&nbsp;」</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// 移除 MusicMenu 导入
import { Error } from "@icon-park/vue-next";
import { getHitokoto } from "@/api";
import { mainStore } from "@/store";
import debounce from "@/utils/debounce.js";

const store = mainStore();

// 移除 openMusicShow

// 一言数据
const hitokotoData = reactive({
  text: "这里应该显示一句话",
  from: "烟雨烟中客",
});

// 获取一言数据
const getHitokotoData = async () => {
  try {
    const result = await getHitokoto();
    hitokotoData.text = result.hitokoto;
    hitokotoData.from = result.from;
  } catch (error) {
    ElMessage({
      message: "一言获取失败",
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
    hitokotoData.text = "这里应该显示一句话";
    hitokotoData.from = "烟雨烟中客";
  }
};

// 更新一言数据
const updateHitokoto = () => {
  // 防抖
  debounce(() => {
    getHitokotoData();
  }, 500);
};

onMounted(() => {
  getHitokotoData();
});
</script>

<style lang="scss" scoped>
.hitokoto {
  width: 100%;
  height: 100%;
  padding: 20px;
  animation: fade 0.5s;
  cursor: pointer; /* 添加指针样式提示可点击 */
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .text {
      font-size: 1.1rem;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .from {
      margin-top: 10px;
      font-weight: bold;
      align-self: flex-end;
      font-size: 1.1rem;
    }
  }
}
</style>