<template>
  <div class="fieldset">
    <label 
      v-for="(field, i) in fields"
      :key="i"
      class="fieldset__item">

      <input
        :name="`radio-fieldset--${name}`"
        :value="field.value"
        v-model="compValue"
        type="radio"
      />
      <img :src="getImgUrl(field.value)" :alt="field.value.toLowerCase()">
    </label>
  </div>
</template>

<script>
  export default {
    name: 'RadioFieldset',

    props: {
      'name': {
        type: String,
        required: true
      },

      'value': {
        type: String,
        required: true
      },

      'fields': {
        type: Array,
        required: true
      }
    },

    methods: {
      getImgUrl(value) {
        var images = require.context('../assets/', false, /\.svg$/)
        return images(`./fieldset-icon--${this.name}--${value.toLowerCase()}.svg`)
      }
    },

    computed: {
      'compValue': {
        get() { return this.value },
        set(newValue) { this.$emit('update:value', newValue) }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .fieldset {
    -webkit-appearance: none;
    margin: 0;
    padding: 0;
    border: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    list-style: none;

    &__item {
      position: relative;

      img {
        height: 100%;
        width: 100%;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
        object-fit: contain;
        border-radius: .25rem;
      }

      input[type=radio] {
        -webkit-appearance: none;
        cursor: pointer;
        height: 3rem;
        width: 4.5rem;      
        margin: 0;
        border-radius: .25rem;
        z-index: 2;
        position: relative;

        &::after, &::before {
          height: 100%;
          width: 100%;
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: .25rem;
          pointer-events: none;
        }

        // Dark border
        &::before {
          transition: box-shadow .1s ease;
          z-index: 4;
          box-shadow: inset 0 0 0 1px rgba(#000, .1);
        }
        
        &::after {
          transition: opacity .1s ease;
          box-shadow: 5px 5px 13px rgba(230, 230, 230, 0.9);
          opacity: 0;
          z-index: -1;
        }

        &:hover, &:checked {
          &::after { opacity: 1 }
        }

        &:checked {
          &::before {
            box-shadow: inset 0 0 0 2px rgba(#000, .3);
          }
        }
      }
    }

    
  }
</style>