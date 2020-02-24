<template>
  <div>
    Elevation:<br>
    <div class="center">
      <input type="range" min="1" max="100" v-model.number="values.elevation"><input type="number" min="1"  max="100" v-model.number="values.elevation">
    </div>
    <br><br>

    Blur:<br>
    <div class="center">
      <input type="range" min="1" max="200" v-model.number="blur"><input type="number" min="1" max="200" v-model.number="blur">
    </div>
    <br><br>

    Intensity:<br>
    <div class="center">
      <input type="range" min="1" max="50" v-model.number="values.intensity"><input type="number" min="1" max="50" v-model.number="values.intensity">
    </div>
    <br><br>

    <fieldset>
      Shadow direction:<br>
      <input type="radio" id="TOP_LEFT" value="TOP_LEFT" v-model="values.shadowDirection">
      <label for="TOP_LEFT">Top left</label>
      <br>
      <input type="radio" id="TOP_RIGHT" value="TOP_RIGHT" v-model="values.shadowDirection">
      <label for="TOP_RIGHT">Top right</label>
      <br>
      <input type="radio" id="BOTTOM_LEFT" value="BOTTOM_LEFT" v-model="values.shadowDirection">
      <label for="BOTTOM_LEFT">Bottom left</label>
      <br>
      <input type="radio" id="BOTTOM_RIGHT" value="BOTTOM_RIGHT" v-model="values.shadowDirection">
      <label for="BOTTOM_RIGHT">Bottom right</label>
    </fieldset>
    <br><br>

    <hr>

    Inset:<br>
    <input type="checkbox" v-model="values.inset">
    <hr>
    <br>
    <button @click="reset">Reset everything</button>
  </div>
</template>

<script>
  const postMsg = (type, value) => {
    // console.log('=> App.vue is executing parent.postMessage() => to main.ts:\n', `    ${type}`, value)
    parent.postMessage({ pluginMessage: { 
      type, value
    }}, '*')
  }

  const generateValues = () => {
    return {
      intensity: 10,
      elevation: 5,
      inset: false,
      manualBlur: null,
      inset: false,
      shadowDirection: 'TOP_LEFT',
    }
  }

  export default {
    name: "App",

    data() {
      return {
        'values': generateValues(),
        'doneInit': false
      }
    },

    watch: {
      'values.intensity': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      },

      'blur': function() {
        if (this.doneInit && this.values.manualBlur)
          postMsg('syncOptions', { options: this.options })
      },

      'values.elevation': function() {
        if (this.doneInit) 
          postMsg('syncOptions', { options: this.options })
      },

      'values.inset': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      },

      'values.shadowDirection': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      }
    },

    computed: {
      'blur': {
        get() {
          return this.values.manualBlur || Math.round((this.values.elevation * 1.1) * 2) // Blur should be a bit more than twice as the elevation
        },
        set (newValue) {
          this.values.manualBlur = parseInt(newValue)
        }
      },

      'options': function() {
        return {
          intensity: this.values.intensity,
          elevation: this.values.elevation,
          inset: this.values.inset,
          shadowDirection: this.values.shadowDirection,
          blur: this.blur,
          blurManuallySet: !!this.values.manualBlur
        }
      }
    },

    methods: {
      reset() {
        this.values = generateValues()
      }
    },

    created() {
      // console.log('pluginStart with', this.options)
      postMsg('pluginStart', { options: this.options })

      onmessage = event => {
        const msg = event.data.pluginMessage

        switch (msg.type) {
          case 'pluginStartDone': {
            this.$nextTick(() => this.doneInit = true)

            break
          }

          case 'overrideOptions': {
            // console.log('Options have been changed by main.ts. Override them in the UI.')

            // Removing blur and blurManuallySet from the options object
            const { blur, blurManuallySet, ...otherOptions } = msg.options

            this.values = { 
              ...otherOptions,
              manualBlur: blurManuallySet ? blur : null
            }

            break
          }
        }
      }
    }
  };
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  font: 12px sans-serif;
  text-align: center;
  margin: 20px;
}
button {
  border-radius: 5px;
  background: white;
  color: black;
  border: none;
  padding: 8px 15px;
  margin: 0 5px;
  box-shadow: inset 0 0 0 1px black;
  outline: none;
}
#create {
  box-shadow: none;
  background: #18a0fb;
  color: white;
}
input {
  border: none;
  outline: none;
  padding: 8px;
}
input:hover {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}
button:focus {
  box-shadow: inset 0 0 0 2px #18a0fb;
}
#create:focus {
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
}
input:focus {
  box-shadow: inset 0 0 0 2px #18a0fb;
}


.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

input[type="number"] {
  width: 50px;
  border: 1px solid #f7f7f8;
}
</style>