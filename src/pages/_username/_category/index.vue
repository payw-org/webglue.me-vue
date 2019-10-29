<template>
  <div class="glue-board-page">
    <Navigation />
    <GlueBoard :fragments="fragments" @cancel="cancelNewFragment" />
    <UrlBar
      v-if="$store.state.glueBoard.isURLBarActive"
      @urlentered="createNewFragment"
    />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import GlueBoard from '~/components/glue-board/GlueBoard'
import UrlBar from '~/components/glue-board/UrlBar'

export default {
  components: { Navigation, GlueBoard, UrlBar },
  data() {
    return {
      fragments: [
        {
          position: {
            x: 50,
            y: 100
          },
          url: 'https://comic.naver.com',
          mode: 'postit',
          selector: ''
        },
        {
          position: {
            x: 550,
            y: 150
          },
          url: 'https://api.dev.webglue.me/v1/mirroring/html?url=apple.com',
          mode: 'postit',
          selector: ''
        }
      ]
    }
  },
  methods: {
    createNewFragment(url) {
      this.$store.commit('glueBoard/setMode', 'new')
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url
      }
      this.fragments.push({
        url,
        mode: 'new',
        position: {
          x: 0,
          y: 0
        }
      })
    },
    cancelNewFragment(index) {
      this.$store.commit('glueBoard/setMode', 'idle')
      this.fragments.splice(index, 1)
    }
  }
}
</script>
