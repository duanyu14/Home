<template>
  <div
    class="hitokoto cards"
    :class="{ mini }"
    @click="updateHitokoto"
  >
    <Transition name="el-fade-in-linear" mode="out-in">
      <div :key="store.hitokotoData.text" class="content">
        <span class="text">{{ store.hitokotoData.text }}</span>
        <span class="from">-「&nbsp;{{ store.hitokotoData.from }}&nbsp;」</span>
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

const getHitokotoData = async () => {
  try {
    const result = await getHitokoto();
    store.setHitokotoData({
      text: result.hitokoto,
      from: result.from
    });
  } catch (error) {
    ElMessage({
      message: "一言获取失败",
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
    store.setHitokotoData({
      text: "这里应该显示一句话",
      from: "烟雨烟中客"
    });
  }
};

const updateHitokoto = () => {
  debounce(() => {
    getHitokotoData();
  }, 500);
};

onMounted(() => {
  if (!store.hitokotoLoaded) {
    getHitokotoData();
  }
});
</script>

<style lang="scss" scoped>
.hitokoto {
  width: 100%;
  height: 100%;
  padding: 20px;
  animation: fade 0.5s;
  cursor: pointer;
  border-radius: 6px;

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

.hitokoto.mini {
  padding: 4px 12px;
  background-color: transparent !important;
  backdrop-filter: none !important;
  border-radius: 0;
  .content {
    flex-direction: column;
    align-items: center;
  }
  .content .text {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
  .content .from {
    font-size: 0.8rem;
    margin-top: 6px;
    opacity: 0.8;
    align-self: center;
  }
}
</style>