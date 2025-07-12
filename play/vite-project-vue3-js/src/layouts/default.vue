<template>
  <div class="default-layout">
    <header>
      <nav>
        <h3>Vite Auto-Router Example</h3>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>Powered by @x-library/vue-router-vite</p>
    </footer>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: #42b883;
  color: white;
  padding: 1rem;
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  background: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}
</style>
