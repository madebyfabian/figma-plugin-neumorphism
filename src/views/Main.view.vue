<template>
  <div v-if="currSelIsValid && !showInitialStartupBtn" class="grid">
    <div class="item">
      <h1 class="item__headline">Elevation</h1>
      <div class="item__img">
        <img src="../assets/preview-image__elevation.svg" alt="Elevation">
      </div>
      <Slider min="1" max="100" :value.sync="values.elevation" />
    </div>

    <div class="item">
      <h1 class="item__headline">Intensity</h1>
      <div class="item__img">
        <img src="../assets/preview-image__intensity.svg" alt="Intensity">
      </div>
      <Slider min="1" max="60" :value.sync="values.intensity" />
    </div>

    <div class="item">
      <h1 class="item__headline">Shape</h1>
      <RadioFieldset :value.sync="values.fillType" name="shape" :fields="[
        { value: 'FLAT' },
        { value: 'CONCAVE' },
        { value: 'CONVEX' },
        { value: 'INSET' }
      ]" />
    </div>

    <div class="item">
      <h1 class="item__headline">Light source</h1>
      <RadioFieldset :value.sync="values.shadowDirection" name="light-source" :fields="[
        { value: 'TOP_LEFT' },
        { value: 'TOP_RIGHT' },
        { value: 'BOTTOM_LEFT' },
        { value: 'BOTTOM_RIGHT' }
      ]" />
    </div>

    <div class="item item--bottom-bar">
      <button @click="resetValues">
        <img src="../assets/icon-swap.svg" alt="Reset to defaults" class="item__icon">
        Reset to defaults
      </button>
      <button @click="removeEffect">
        <img src="../assets/icon-delete.svg" alt="Remove effect" class="item__icon">
        Remove effect
      </button>
    </div>
  </div>

  <div v-else-if="!currSelIsValid" class="center-container">
    <div>
      <p>
        Please select something 😊
      </p>
      <p>
        <span>Everything exept multiple nodes<br> and groups is suported!</span>
      </p>
    </div>
  </div>

  <div v-else class="center-container">
    <button @click="resetValues" class="start-btn">Neumorph' it!</button>
  </div>
</template>

<script>
  const postMsg = (type, value) => parent.postMessage({ pluginMessage: { type, value }}, '*'),
        generateValues = () => {
          return { intensity: 10, elevation: 5, shadowDirection: 'TOP_LEFT', manualBlur: false, fillType: 'FLAT' }
        }

  import Slider from '../components/Slider'
  import RadioFieldset from '../components/RadioFieldset'

  export default {
    name: "App",

    components: {
      Slider,
      RadioFieldset
    },

    data() {
      return {
        'values': generateValues(),
        'doneInit': false,
        'currSelIsValid': false,
        'showInitialStartupBtn': false
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
        if (init || this.doneInit)
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
    }
  };
</script>

<style lang="scss" scoped>
  .grid {
    display: grid;
    gap: 3.5rem 2rem;
    grid-template: 1fr / 1fr 1fr;

    .item {
      &--bottom-bar {
        grid-column: 1 / 3;
        margin: 0 -1rem;
        height: 40px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;

        button {
          -webkit-appearance: none;
          width: 50%;
          height: 100%;
          background: transparent;
          border: none;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:last-child {
            border-left: 1px solid rgba(0, 0, 0, 0.1);
            color: #F24822;
          }

          .item__icon {
            height: 1rem;
            width: 1rem;
            display: block;
            margin: 0 .375rem 0 0;
          }
        }
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
        margin: 1rem 0;

        img {
          width: 100%;
          height: auto;
          pointer-events: none;
        }
      }
    }
  }

  .center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 1.25rem);
    margin-bottom: 1.25rem;
    text-align: center;
    line-height: 1.5;

    span {
      opacity: .5;
    }
  }

  .start-btn {
    height: 32px;
    background: #18A0FB;
    border-radius: 6px;
    padding: 0 16px;
    border: none;
    color: #fff;
  }
</style>