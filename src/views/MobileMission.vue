<script>
import MyMission from "@/components/missions/MyMission";
export default {
  name: "MobileMission",
  data: () => ({}),
  components: {
    MyMission,
  },
};
</script>
<template>
  <div>
    {{ this.$route.params.id }}
    <MyMission />
  </div>
</template>