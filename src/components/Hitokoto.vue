<template>
  <div
    class="hitokoto"
    :class="{ mini }"
    @click="updateHitokoto"
  >
    <Transition name="el-fade-in-linear" mode="out-in">
      <div :key="hitokotoData.text" class="content">
        <span class="text">{{ hitokotoData.text }}</span>
        <span v-if="!mini" class="from">-「&nbsp;{{ hitokotoData.from }}&nbsp;」</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Error } from "@icon-park/vue-next";
import { getHitokoto } from "@/api";
import { mainStore } from "@/store";
import debounce from "@/utils/debounce.js";

const props = defineProps({
  mini: {
    type: Boolean,
    default: false
  }
});

const store = mainStore();

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
  cursor: pointer;

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

/* 新增的 mini 模式样式 */
.hitokoto.mini {
  padding: 4px 12px;
  .content .text {
    font-size: 0.9rem;
    -webkit-line-clamp: 1;
  }
}
</style>