<template>
  <div class="glue-board-scroll-wrapper">
    <div class="glue-board-fragment-container">
      <Fragment
        v-for="(frag, i) in fragments"
        :key="frag.id"
        :frag-info="frag"
        :class="`fragment-${frag.id}`"
        @cancel="cancelNewFragment(i)"
        @sniff="updateSelector"
        @exitnewmode="changeModeTo($event, 'postit', i)"
      />
    </div>
    <UrlBar
      v-if="$store.state.glueBoard.isURLBarActive"
      @urlentered="createNewFragment"
    />
    <Selector v-if="$store.state.glueBoard.mode === 'new'" :rect="rect" />
  </div>
</template>

<script>
import Fragment from '~/components/glue-board/Fragment'
import UrlBar from '~/components/glue-board/UrlBar'
import Selector from '~/components/glue-board/Selector'

export default {
  components: { Fragment, UrlBar, Selector },
  data() {
    return {
      fragments: [],
      rect: {
        x: 0,
        y: 0,
        width: 0,
        heigth: 0
      }
    }
  },
  watch: {
    fragments() {}
  },
  mounted() {
    this.loadFragments()
  },
  methods: {
    sniff(payload) {
      this.$emit('sniff', payload)
    },
    changeModeTo(payload, mode, index) {
      console.log('change mode to ' + mode)
      this.fragments[index].mode = mode
      console.log(payload)
      this.fragments[index].position = payload.position
      this.fragments[index].size = payload.size
      console.log(JSON.stringify(this.fragments, null, 2))
    },
    generateRandomId() {
      return Math.random()
        .toString(36)
        .substr(2, 5)
    },
    loadFragments() {
      this.fragments = [
        {
          position: {
            x: 50,
            y: 100
          },
          size: {
            width: 400,
            height: 550
          },
          url: 'https://comic.naver.com',
          mode: 'postit',
          selector: '',
          id: this.generateRandomId()
        },
        {
          position: {
            x: 500,
            y: 150
          },
          size: {
            width: 400,
            height: 550
          },
          url: 'https://comic.naver.com',
          mode: 'postit',
          selector: '',
          id: this.generateRandomId()
        }
      ]
    },
    updateSelector(payload) {
      this.rect = payload
    },
    createNewFragment(url) {
      this.$store.commit('glueBoard/setMode', 'new')
      this.fragments.push({
        position: {
          x: null,
          y: null
        },
        size: {
          width: null,
          heigth: null
        },
        url,
        mode: 'new',
        selector: '',
        id: this.generateRandomId()
      })
    },
    cancelNewFragment(index) {
      this.$store.commit('glueBoard/setMode', 'idle')
      this.fragments.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
// Transitions
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 500ms ease;
  transform: translateY(0%);
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

.glue-board-scroll-wrapper {
  position: fixed;
  top: 0;
  padding-top: 3.5rem;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;

  .glue-board-fragment-container {
    display: inline-block;
  }
}
</style>
