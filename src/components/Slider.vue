<template>
  <div class="slider">
    <div class="slider__track-progress" :style="{ 'width': `${value}%` }"></div>
    <input class="slider__native-input" type="range" min="1" max="100" v-model="value">

    <span v-text=value></span>
  </div>
</template>

<script>
  export default {
    name: 'Slider',

    data() {
      return {
        value: 0
      }
    },

    methods: {
      knobMouseDown(e) {
        this.i += 1
        console.log('fuck yeah!', e.clientX)
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

    @at-root .using-mouse .slider {
      background: green;
    }

    &__track-progress {
      height: .25rem;
      width: 100%;
      background: #808080;
      border-radius: .25rem;
      overflow: hidden;
      transform: translateY(.375rem);
      z-index: 1;
      pointer-events: none;
    }

    &__native-input {
      -webkit-appearance: none;
      width: 100%;
      margin: 0;
      height: 1rem;
      z-index: 0;
      cursor: pointer;

      &:focus {
        outline: none;

        &::-webkit-slider-runnable-track, &::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(#4D90FE, .5);
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

        &:hover {
          transform: scale(1.25);
        }
      }
    }

    span {
      position: absolute;
      bottom: -2rem;
    }
  }
</style>