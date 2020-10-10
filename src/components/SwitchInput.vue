<template>
  <div class="switch">
    <label>
      <input
        :name="name" 
        :checked="value"
        :tabindex="1"
        @change="$emit('input', $event.target.checked)"
        type="checkbox" 
        class="switch__input" 
        ref="input"
      />
      <span class="switch__label"><slot /></span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'SwitchInput',
    props: {
      'name': {
        type: String,
        default: ''
      },
      'value': {
        type: Boolean,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .switch {
    display: flex;
    height: 1rem;
    label {
      display: flex;
      align-items: center;
    }
    &__input {
      --active: #333;
      --active-inner: #fff;
      --input-border: #333;
      -webkit-appearance: none;
      outline: none;
      border: none;
      padding: 0;
      margin: 0;
      background: transparent;
      position: relative;
      border: 1px solid var(--input-border);
      width: 24px;
      height: 12px;
      border-radius: 11px;
      transition: background-color .2s ease;
      
      &:after {
        content: '';
        display: block;
        left: -1px; // hack
        top: -1px; // hack
        border-radius: 50%;
        width: 12px;
        height: 12px;
        position: absolute;
        border: 1px solid var(--input-border);
        transition: transform .2s ease;
        background: #fff;
      }
      
      &:checked {
        background-color: var(--active);
        
        &:after {
          transform: translateX(12px);
        }
      }
    }
    &__label {
      padding-left: .5rem;
    }
  }
</style>