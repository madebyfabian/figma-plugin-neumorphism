<template>
  <div>
    Elevation:<br>
    <div class="center">
      <input type="range" min="1" max="100" v-model.number="elevation"><input type="number" min="1"  max="100" v-model.number="elevation">
    </div>
    <br><br>

    Blur:<br>
    <div class="center">
      <input type="range" min="1" max="200" v-model.number="blur"><input type="number" min="1" max="200" v-model.number="blur">
    </div>
    <br><br>

    Intensity:<br>
    <div class="center">
      <input type="range" min="1" max="50" v-model.number="intensity"><input type="number" min="1" max="50" v-model.number="intensity">
    </div>
    <br><br>

    <hr>

    Inset:<br>
    <input type="checkbox" v-model="inset">
    <hr>
    <br>
    <button @click="reset">Reset everything</button>
  </div>
</template>

<script>
  const postMsg = (type, value) => {
    parent.postMessage({ pluginMessage: { 
      type, value
    }}, '*')
  }

  export default {
    name: "App",

    data() {
      return {
        'intensity': 10,
        'elevation': 5,
        'inset': false,
        'manualBlur': null,

        'doneInit': false,
        'initialOptions': { intensity: 10, elevation: 5, inset: false, manualBlur: null, inset: false }
      }
    },

    watch: {
      'intensity': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      },

      'blur': function() {
        if (this.doneInit && this.manualBlur)
          postMsg('syncOptions', { options: this.options })
      },

      'elevation': function() {
        if (this.doneInit) {
          postMsg('syncOptions', { options: this.options })
        }
      },

      'inset': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      }
    },

    computed: {
      'blur': {
        get() {
          return this.manualBlur || (this.elevation * 2)
        },
        set (newValue) {
          this.manualBlur = parseInt(newValue)
        }
      },

      'options': function() {
        return {
          intensity: this.intensity,
          blur: this.blur,
          elevation: this.elevation,
          inset: this.inset,
          blurManuallySet: !!this.manualBlur
        }
      }
    },

    methods: {
      reset() {
        this.intensity = this.initialOptions.intensity
        this.elevation = this.initialOptions.elevation
        this.blur = this.initialOptions.blur
        this.manualBlur = this.initialOptions.manualBlur
        this.inset = this.initialOptions.inset
      }
    },

    created() {
      postMsg('pluginStart', { options: this.options })

      onmessage = event => {
        const msg = event.data.pluginMessage

        switch (msg.type) {
          case 'pluginStartDone': {
            this.$nextTick(() => this.doneInit = true)
            break
          }

          case 'overrideOptions': {
            console.log('Options have been changed by main.ts. Override them in the UI.')
            this.intensity = msg.options.intensity
            this.blur = msg.options.blur
            this.manualBlur = msg.options.blurManuallySet ? msg.options.blur : null
            this.elevation = msg.options.elevation
            this.inset = msg.options.inset
          }

          // case 'syncOptions': {
          //   // const options = msg.options

          //   // this.blur = options.blur
          //   // this.blurMax = options.blur * 2

          //   // this.elevation = options.elevation
          //   // this.elevationMax = options.elevation * 5

          //   // if (msg.type === 'pluginStartDone')
          //   //   this.$nextTick(() => {
          //   //     this.doneInit = true
          //   //   })

          //   break
          // }
          
          default:
            break
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