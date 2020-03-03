<template>
  <!-- <div v-if="currSelIsValid && !showInitialStartupBtn">
    Elevation:<br>
    <div class="center">
      <input type="range"  min="1" max="100" v-model.number="values.elevation">
      <input type="number" min="1" max="100" v-model.number="values.elevation">
    </div>
    <br><br>

    Blur:<br>
    <div class="center">
      <input type="range"  min="1" max="200" v-model.number="blur">
      <input type="number" min="1" max="200" v-model.number="blur">
    </div>
    <br><br>

    Intensity:<br>
    <div class="center">
      <input type="range"  min="1" max="60" v-model.number="values.intensity">
      <input type="number" min="1" max="60" v-model.number="values.intensity">
    </div>
    <br><br>

    <fieldset>
      Shadow direction:<br>
      <div class="center">
        <input type="radio" id="TOP_LEFT" value="TOP_LEFT" v-model="values.shadowDirection">
        <label for="TOP_LEFT">Top left</label>&nbsp;&nbsp;
        <br>
        <input type="radio" id="TOP_RIGHT" value="TOP_RIGHT" v-model="values.shadowDirection">
        <label for="TOP_RIGHT">Top right</label>
      </div>
      <div class="center">
        <input type="radio" id="BOTTOM_LEFT" value="BOTTOM_LEFT" v-model="values.shadowDirection">
        <label for="BOTTOM_LEFT">Bottom left</label>&nbsp;&nbsp;
        <br>
        <input type="radio" id="BOTTOM_RIGHT" value="BOTTOM_RIGHT" v-model="values.shadowDirection">
        <label for="BOTTOM_RIGHT">Bottom right</label>
      </div>
    </fieldset>
    <br><br>

    <fieldset>
      Fill type:<br>
      <div class="center">
        <input type="radio" id="FLAT" value="FLAT" v-model="values.fillType">
        <label for="FLAT">Flat</label>&nbsp;&nbsp;
        <br>
        <input type="radio" id="CONCAVE" value="CONCAVE" v-model="values.fillType">
        <label for="CONCAVE">Concave</label>&nbsp;&nbsp;
      </div>
      <div class="center">
        <input type="radio" id="CONVEX" value="CONVEX" v-model="values.fillType">
        <label for="CONVEX">Convex</label>
        <br>
        <input type="radio" id="INSET" value="INSET" v-model="values.fillType">
        <label for="INSET">Inset</label>
      </div>
    </fieldset>
    <br><br>

    <button @click="resetValues">Reset to defaults</button>
    <button @click="removeEffect">Remove effect</button>
  </div>


  <div v-else-if="!currSelIsValid" class="center-container center">
    Please select something :)
  </div>

  <div v-else class="center-container center">
    <button @click="resetValues">Neumorph' it!</button>
  </div> -->

  
  <div :class="a11yClass" @mouseenter="() => a11yClassChange(false)">
    <Slider />
  </div>

  <!-- <div class="grid">
    <div class="item">
      <h1 class="item__headline">Elevation</h1>
      <div class="item__img">
        <img src="./assets/preview-image__elevation.svg" alt="Elevation">
      </div>
      
    </div>

    <div class="item">
      Test
    </div>

    <div class="item">
      Test
    </div>

    <div class="item">
      Test
    </div>

    <div class="item item--bottom-bar">
      Test
    </div>
  </div> -->
</template>

<script>
  const postMsg = (type, value) => {
    // console.log('=> App.vue is executing parent.postMessage() => to main.ts:\n', `    ${type}`, value)
    parent.postMessage({ pluginMessage: { 
      type, value
    }}, '*')
  }

  const generateValues = () => {
    return { intensity: 10, elevation: 5, shadowDirection: 'TOP_LEFT', manualBlur: false, fillType: 'FLAT' }
  }

  import Slider from './components/Slider'

  export default {
    name: "App",

    components: {Slider},

    data() {
      return {
        'values': generateValues(),
        'doneInit': false,
        'currSelIsValid': false,
        'showInitialStartupBtn': false,

        'a11yClass': 'using-keyboard'
      }
    },

    watch: {
      'blur': function() {
        if (this.doneInit && this.values.manualBlur)
          postMsg('syncShadowOptions', { options: this.options })
      },

      'values.intensity'()        { this.syncShadowOptions() },
      'values.elevation'()        { this.syncShadowOptions() },
      'values.shadowDirection'()  { this.syncShadowOptions() },
      'values.fillType'()         { this.syncFillType() }
    },

    computed: {
      'blur': {
        get() {
          return this.values.manualBlur || Math.round(this.values.elevation * 2)
        },
        set (newValue) {
          this.values.manualBlur = parseInt(newValue)
        }
      },

      'options'() {
        const { manualBlur, ...otherValues } = this.values

        return {
          ...otherValues,
          blur: this.blur,
          blurManuallySet: !!manualBlur
        }
      },
    },

    methods: {
      syncShadowOptions( init = false ) {
        if (!init && !this.doneInit)
          return 

        postMsg('syncShadowOptions', { options: this.options, init: init })
      },

      syncFillType() {
        if (!this.doneInit)
          return

        postMsg('syncFillType', { options: this.options })
      },

      resetValues() {
        this.doneInit = false

        this.values = generateValues()
        this.syncShadowOptions(true)

        this.$nextTick(() => this.doneInit = true)
      },

      removeEffect() {
        this.doneInit = false
        this.showInitialStartupBtn = true

        postMsg('removeEffect', { options: {} })
      },

      a11yClassChange(usingKeyboard) {
        this.a11yClass = usingKeyboard ? 'using-keyboard' : 'using-mouse'
      }
    },

    created() {
      onmessage = event => {
        const msg = event.data.pluginMessage

        switch (msg.type) {
          case 'currNodeChanged': {
            this.doneInit = false

            this.currSelIsValid = msg.value.currSelIsValid
            if (!this.currSelIsValid) 
              break
            
            // If current selected node is "fresh", so has no neumorphism on it.
            const optionsStoredOnNode = msg.value.optionsStoredOnNode
            this.showInitialStartupBtn = !optionsStoredOnNode
            if (this.showInitialStartupBtn)
              break

            const { blur, blurManuallySet, ...otherOptions } = msg.value.optionsStoredOnNode
            this.values = { 
              ...otherOptions,
              manualBlur: blurManuallySet ? blur : null
            }

            this.$nextTick(() => this.doneInit = true)

            break
          }
        }

      }
    },

    mounted() {
      window.addEventListener('keydown', function(e) {
        this.a11yClassChange(true)
      }.bind(this));
    }
  };
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }
  
  #app {
    font-family: "Inter", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333;
    margin-top: 60px;
  }

  body {
    font: 12px sans-serif;
    margin: 1.25rem 1rem 0;
    user-select: none;
  }

  .grid {
    display: grid;
    gap: 3.5rem 2rem;
    grid-template: 1fr / 1fr 1fr;

    .item {
      &--bottom-bar {
        grid-column: 1 / 3;
        margin: 0 -1rem;
        height: 40px;
      }

      &__headline {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: -0.015em;
        margin: 0 0 1rem;
      }

      &__img {
        height: 7.5rem;
        width: 10rem;
        background: rgba(#000, .03);
        border-radius: 1rem;

        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
</style>