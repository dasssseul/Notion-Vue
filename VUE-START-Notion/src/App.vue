<template>
  <div class="app__inner">
    <LNB />
    <div class="app__page">
      <Header />
      <div class="page__container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import LNB from '~/components/LNB'
import Header from '~/components/Header'
export default {
 components : {
   LNB, 
   Header
 }
}
</script>

<style lang="scss" scoped>

.app__inner {
  display: flex;
  height: 100vh;
  font-size: 14px;
  line-height: 1.4;
  font-family: 'Noto Sans KR', sans-serif;
  color: $color-font;

  .app__nav{
    width: 240px;
    height: 100%;
  }
  .app__page{
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    .page__header{
      height: 80px;
    }
    .page__container{
      flex-grow: 1;
      overflow-y: auto;
    }
  }
}
  
</style>
