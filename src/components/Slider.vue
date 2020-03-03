<template>
  <div class="slider">
    <div class="slider__track-progress" :style="{ 'width': trackProgressCSS }"></div>
    
    <input 
      :min="min"
      :max="max" 
      :step="step"
      v-model.number="compValue"
      type="range"
    />
    <div class="slider__popover" :style="{ 'left': trackProgressCSS }" :data-value="value"></div>
  </div>
</template>

<script>
  export default {
    name: 'Slider',

    props: {
      'min': {
        type: String,
        default: "1"
      },
      'max': {
        type: String,
        default: "100"
      },
      'step': {
        type: String,
        default: "1"
      },
      'value': {
        type: Number,
        required: true
      }
    },

    computed: {
      'trackProgressCSS'() {
        const width = Math.round((this.value - this.min) / (this.max - this.min) * 100),
              pos   = ((50 - width) * 2 / 100 * 8)

        return `calc(${width}% + ${pos}px)`
      },

      'compValue': {
        get() { return this.value },
        set(newValue) { this.$emit('update:value', newValue) }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .slider {
    height: 1rem;
    width: 100%;
    max-width: 10rem;
    position: relative;

    > * {
      position: absolute;
    }

    &__track-progress {
      height: .25rem;
      max-width: 100%;
      background: #808080;
      z-index: 1;
      pointer-events: none;
      border-radius: .25rem;
      margin: .375rem 0 0 0;
    }

    &__popover {
      margin: -1.5rem 0 0 -.5rem;
      height: 1.25rem;
      width: 1rem;
      z-index: 2;
      display: flex;
      justify-content: center;
      pointer-events: none;
      transform: translateY(.25rem);
      opacity: 0;
      transition: opacity .15s ease, transform .15s ease;
      
      &::after {
        content: attr(data-value);
        position: relative;
        z-index: 3;
        color: #555;
        background: #E5E5E5;
        border-radius: 1rem;
        padding: 0 .5rem;
        line-height: 1.25rem;
      }
    }

    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      margin: 0;
      height: 1rem;
      z-index: 0;
      cursor: pointer;

      @at-root .using-keyboard input[type=range]:focus, &:hover {
        & + .slider__popover {
          opacity: 1;
          transform: none;
        }

        &::-webkit-slider-thumb {
          transform: scale(1.25);
        }
      }

      &::-webkit-slider-runnable-track {
        width: 100%;
        height: .25rem;
        background: rgba(#000, 0.1);
        border: none;
        border-radius: .25rem;
        transition: box-shadow .15s ease;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        height: 1rem;
        width: 16px;
        border-radius: 50%;
        background: #808080;
        margin-top: -.375rem;
        transition: transform .1s ease;
        box-shadow: 0px 2px 4px rgba(87, 116, 138, 0.25);
      }
    }
  }
</style>