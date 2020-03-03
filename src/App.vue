<template>
  <main :class="a11yClass">
    <MainView />
  </main>
</template>

<script>
  import MainView from './views/Main.view'

  export default {
    name: "App",

    components: { MainView },

    data() {
      return {
        'a11yClass': 'using-keyboard'
      }
    },

    methods: {
      a11yClassChange(usingKeyboard) {
        this.a11yClass = usingKeyboard ? 'using-keyboard' : 'using-mouse'
      }
    },

    mounted() {
      window.addEventListener('keydown', (e) => this.a11yClassChange(true))
      window.addEventListener('mousedown', (e) => this.a11yClassChange(false))
      window.addEventListener('touchstart', (e) => this.a11yClassChange(false))
    }
  };
</script>

<style lang="scss">
  @font-face {
    font-family: 'Inter var';
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
    font-named-instance: 'Regular';
    src: url('./assets/fonts/Inter-roman.var.woff2?v=3.11') format('woff2');
  }

  * {
    font-family: 'Inter var', system-ui, sans-serif!important;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &:focus { 
      outline: none;
    }
  }

  html {
    font-size: 16px;
  }

  html, * {
    letter-spacing: -.05;
    box-sizing: border-box;
  }

  .using-keyboard *:focus {
    box-shadow: 0 0 0 3px rgba(#4D90FE, .33);
  }
  
  body {
    margin: 1.25rem 1rem 0;
    color: #333;
    overflow: hidden;
    font-size: 12px;
  }
</style>