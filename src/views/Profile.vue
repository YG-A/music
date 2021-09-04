<template>
  <transition>
    <div class="profile">
      <ProfileHeader></ProfileHeader>
      <ProfileBottom></ProfileBottom>
    </div>
  </transition>
</template>
<script>
import ProfileHeader from '../components/Profile/ProfileHeader.vue'
import ProfileBottom from '../components/Profile/ProfileBottom.vue'
export default {
  name: 'Profile',
  components: {
    ProfileHeader, ProfileBottom
  }
}
</script>
<style lang="scss" scoped>
  @import '../assets/css/mixin.scss';
  .profile{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    @include bg_sub_color();
  }
  .v-enter,.v-leave-to{
    transform: translateX(-100%);
  }
  .v-enter-to,.v-leave{
    transform: translateX(0%);
  }
  .v-enter-active,.v-leave-active{
    transition: transform 0.5s;
  }
</style>
