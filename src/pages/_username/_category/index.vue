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
            x: 20,
            y: 100
          },
          url: 'https://comic.naver.com',
          mode: 'postit',
          selector: ''
        },
        {
          position: {
            x: 500,
            y: 150
          },
          url: 'https://comic.naver.com',
          mode: 'postit',
          selector: ''
        },
        {
          position: {
            x: 300,
            y: 500
          },
          url: 'https://comic.naver.com',
          mode: 'postit',
          selector: ''
        }
      ]
    }
  },
  methods: {
    createNewFragment(url) {
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url
      }
      this.fragments.push({
        url,
        mode: 'new'
      })
    },
    cancelNewFragment(index) {
      this.fragments.splice(index, 1)
    }
  }
}
</script>
