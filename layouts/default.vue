<template>
  <div class="layout-container">
    <header class="header"></header>
    <slot />
    <footer class="footer"></footer>
  </div>
</template>

<style scoped lang="scss">
.layout-container {
  height: 100%;
display: flex;
  flex-direction: column;
  justify-content: space-between;
}


.header, .footer {
  background-color: #474747;
}

.header {
  height: 60px;
}

.footer {
  height: 260px;
}


</style>
