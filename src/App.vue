<template>
  <div v-if="currSelIsValid && !showInitialStartupBtn">
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
        <br>
        <input type="radio" id="CONVEX" value="CONVEX" v-model="values.fillType">
        <label for="CONVEX">Convex</label>
      </div>
    </fieldset>
    <br><br>

    <div class="center">
      <input type="checkbox" id="INSET" v-model="values.inset">
      <label for="INSET">Inset</label>
    </div>
    <br><br>

    <button @click="resetValues">Reset everything</button>
  </div>


  <div v-else-if="!currSelIsValid" class="center-container center">
    Please select something :)
  </div>

  <div v-else class="center-container center">
    <button @click="resetValues">Neumorph' it!</button>
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
    return { intensity: 10, elevation: 5, inset: false, shadowDirection: 'TOP_LEFT', manualBlur: false, fillType: 'FLAT' }
  }

  export default {
    name: "App",

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
      'values.inset'()            { this.syncShadowOptions() },
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

      'options': function() {
        const { manualBlur, ...otherValues } = this.values

        return {
          ...otherValues,
          blur: this.blur,
          blurManuallySet: !!manualBlur
        }
      }
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
  user-select: none;
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
/* input:focus {
  box-shadow: inset 0 0 0 2px #18a0fb;
} */


.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

input[type="number"] {
  width: 50px;
  border: 1px solid #f7f7f8;
}

.center-container {
  height: calc(100vh - 40px);
}
</style>