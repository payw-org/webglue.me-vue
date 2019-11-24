<template>
  <nav class="webglue-navigation" :class="{ hidden: isHidden }">
    <div class="gn-menu-container">
      <button class="logo-wrapper" @click="gotoHome">
        <a :href="homeLink" class="home-link">
          <div class="logo-box">
            <div class="logo-container">
              <img
                src="~/assets/images/logo-simplified.svg"
                alt="logo"
                class="logo-img"
              />
            </div>
          </div>
          <h1 class="name">
            webglue
          </h1>
        </a>
      </button>
      <div class="icon-container">
        <div class="logout" @click="logout">
          로그아웃
        </div>
        <div v-if="$route.params.category">
          <button class="add-btn" @click="onClickAddBtn">
            <IconPlus class="add-icon" color="#ff176b" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Axios from 'axios'
import IconPlus from '~/components/icons/IconPlus.vue'

export default {
  components: { IconPlus },
  data() {
    return {
      homeLink: ''
    }
  },
  computed: {
    isHidden() {
      if (this.$store.state.glueBoard.mode !== 'idle') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    gotoHome() {
      this.homeLink = `/@${this.$store.state.auth.userInfo.nickname}`
    },
    onClickAddBtn() {
      this.$store.commit('glueBoard/setUrlBarActive', true)
    },
    logout() {
      Axios.delete('https://api.dev.webglue.me/v1/oauth2/google', {
        withCredentials: true
      })
        .then(() => {
          window.location.replace('/')
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

$nav-height: 3.5rem;

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.webglue-navigation {
  z-index: 9999;
  display: flex;
  position: sticky;
  top: 0;
  width: 100%;
  min-width: 100%;
  height: $nav-height;
  background-color: rgba(#fff, 0.8);
  transition: transform 200ms ease;
  @include bgBlur;

  &.hidden {
    transform: translateY(-100%);
    pointer-events: none;
  }

  .gn-menu-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 80rem;
    margin: auto;
    padding: 0 1rem;

    .logo-wrapper {
      .home-link {
        display: flex;
        align-items: center;
        z-index: 10000;
        .logo-box {
          padding-right: 0.5rem;
          .logo-container {
            display: flex;
            align-items: center;
            width: $nav-height * 0.6;
            height: $nav-height * 0.6;
            animation-name: rotation;
            animation-duration: 5s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;

            .logo-img {
              width: $nav-height * 0.6;
              height: auto;
            }
          }
        }
      }

      .name {
        font-weight: 700;
        font-size: $nav-height * 0.45;
        user-select: none;
        color: #000000;
      }
    }

    .icon-container {
      display: flex;
      flex-direction: row;
      .logout {
        color: #8b8b8b;
        font-size: 1rem;
        padding-right: 0.8rem;
        display: flex;
        align-items: center;
      }

      .add-btn {
        width: $nav-height * 0.7;
        height: $nav-height * 0.7;
        background-color: #fff;
        border-radius: 0.4rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 200ms ease;

        &:hover {
          background-color: #f5f5f7;
        }

        &:active {
          background-color: #e8e8e8;
        }

        .add-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 55%;
        }
      }
    }
  }
}
</style>
