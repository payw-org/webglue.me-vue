<template>
  <div class="glue-board-page">
    <Navigation @sharing="activatePopUp" @deactivatepopup="deactivatePopUp" />
    <GlueBoard :glue-board-id="$route.params.category" />
    <div class="popup-field">
      <div class="popup-max">
        <div v-if="isActivatePopUp" class="popup">
          <div class="arrow" />
          <div class="sharing-box">
            <div class="input-group">
              <input type="text" class="url-link" readonly :value="publicUrl" />
              <Button class="link-copy-btn" @click="copyLink">
                <img class="share-img" src="~/assets/images/clipboard.svg" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'
import GlueBoard from '~/components/glue-board/GlueBoard'

export default {
  components: { Navigation, GlueBoard },
  data() {
    return {
      isActivatePopUp: false,
      glueboardLink: '',
      glueboardHash: ''
    }
  },

  computed: {
    publicUrl() {
      const link = 'https://webglue.me/public/' + this.glueboardHash
      return link
    }
  },
  mounted() {
    window.addEventListener('mousedown', e => {
      /** @type {HTMLElement} */
      const target = e.target
      if (!target.closest('.popup') && !target.closest('.share-icon-wrapper')) {
        this.isActivatePopUp = false
      }
    })
  },
  methods: {
    copyLink() {
      var textArea = document.createElement('textarea')
      textArea.value = this.publicUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    },
    deactivatePopUp() {
      this.isActivatePopUp = false
    },
    activatePopUp(hash) {
      if (this.isActivatePopUp === false) {
        this.isActivatePopUp = true
        this.glueboardHash = hash
      } else {
        this.deactivatePopUp()
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';
.popup-field {
  display: flex;
  justify-content: center;
  pointer-events: none;

  .popup-max {
    width: 100%;
    max-width: 80rem;
    z-index: 10001;
    height: 100%;
    position: fixed;

    .popup {
      right: 1.5rem;
      position: absolute;
      top: 0.8rem;

      .arrow {
        width: 2rem;
        height: 2rem;
        transform: rotate(45deg) translateX(-50%);
        border-radius: 5px;
        box-shadow: 0 0 1rem rgba(#000, 0.2);
        position: absolute;
        z-index: -1;
        right: 50%;
        background-color: #fff;
      }

      .sharing-box {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 6rem;
        width: 20rem;
        border-radius: 0.84rem;
        background-color: #fff;
        box-shadow: 0 1rem 5rem rgba(#000, 0.2);
        pointer-events: all;

        .input-group {
          width: 80%;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;

          .url-link {
            border-left: 1px solid #d1d5da;
            border-top: 1px solid #d1d5da;
            border-bottom: 1px solid #d1d5da;
            padding-top: 0.4rem;
            padding-bottom: 0.4rem;
            padding-left: 0.4rem;
            background-color: #fff;
            height: 100%;
            box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
          }

          .link-copy-btn {
            width: 2rem;
            height: 100%;
            border: 1px solid #d1d5da;
            display: flex;
            justify-content: center;
            align-items: center;

            .share-img {
              width: 55%;
              height: 55%;
            }
          }
        }
      }
    }
  }
}
</style>
