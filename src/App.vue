<template>
  <div>
    <!-- <img src="./logo.svg" alt="Logo" />
    <h2>Rectangle Creators</h2>
    <p>
      Count:
      <input type="number" v-model.number="count" value="2" />
    </p> -->
    <!-- <button>Reset values</button> -->

    Elevation:<br>
    <div class="center">
      <input type="range" min="1" :max="elevationMax" v-model.number="elevation"><input type="number" min="1" :max="elevationMax" v-model.number="elevation">
    </div>
    <br><br>

    Intensity:<br>
    <input type="range" min="1" max="50" v-model.number="intensity">
    <br><br>

    Blur:<br>
    <input type="range" min="1" :max="blurMax" v-model.number="blur">
    <br><br>

    <hr>

    Inset:<br>
    <input type="checkbox" v-model="inset">
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
        'blur': 50,
        'blurMax': 100,
        'elevation': 20,
        'elevationMax': 100,
        'inset': false,

        'doneInit': false
      }
    },

    watch: {
      'intensity': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      },

      'blur': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      },

      'elevation': function() {
        if (this.doneInit) {
          this.blur = this.elevation * 2
          postMsg('syncOptions', { options: this.options })
        }
      },

      'inset': function() {
        if (this.doneInit)
          postMsg('syncOptions', { options: this.options })
      }
    },

    computed: {
      'options': function() {
        return {
          intensity: this.intensity / 100,
          blur: this.blur,
          elevation: this.elevation,
          inset: this.inset
        }
      }
    },

    created() {
      postMsg('pluginStart', { 
        options: {
          ...this.options,
          blur: null,
          elevation: null
        }
      })

      onmessage = event => {
        const msg = event.data.pluginMessage

        switch (msg.type) {
          case 'syncOptions': case 'pluginStartDone': {
            const options = msg.options

            this.blur = options.blur
            this.blurMax = options.blur * 2

            this.elevation = options.elevation
            this.elevationMax = options.elevation * 5

            if (msg.type === 'pluginStartDone')
              this.$nextTick(() => {
                this.doneInit = true
              })

            break
          }
          
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
</style>