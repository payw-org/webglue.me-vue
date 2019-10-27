<template>
  <div class="profile">
    <div class="profile-wrapper">
      <div class="img">
        profile image
      </div>
      <div class="contents-wrapper">
        <div class="name-wrapper">
          <div class="name">
            이름
          </div>
          <div class="myname">
            이성민
          </div>
        </div>
        <div class="email-wrapper">
          <div class="email">
            이메일
          </div>
          <div class="myemail">
            dltjdals98@naver.com
          </div>
        </div>
        <div class="nickname-wrapper">
          <div class="nickname">
            닉네임
          </div>
          <div class="mynickname">
            이
          </div>
        </div>
        <div class="nickname-edit-wrapper">
          <button class="nickname-edit-button" @click="activatePopUp">
            <img class="edit-img" src="~assets/images/edit.png" />
            <div class="edit-nickname">
              닉네임 수정
            </div>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isPopUpActive" class="popup">
      <div class="bg" @click="deactivatePopUp" />
      <div class="input-box">
        <input v-model="newNickname" type="text" placeholder="새 닉네임" />
        <button @click="updateNickname">
          수정
        </button>
        <button @click="deactivatePopUp">
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPopUpActive: false,
      newNickname: ''
    }
  },
  methods: {
    activatePopUp() {
      this.isPopUpActive = true
    },
    deactivatePopUp() {
      this.isPopUpActive = false
    },
    updateNickname() {
      console.log(this.newNickname)
      this.deactivatePopUp()
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.profile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .profile-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 5rem 0;

    .img {
      width: 20rem;
      height: 25rem;
      border: solid black 1px;
    }
    .contents-wrapper {
      padding-top: 1.5rem;
      .name-wrapper,
      .email-wrapper,
      .nickname-wrapper {
        padding-top: 2rem;
        display: flex;
        flex-direction: row;
        .name,
        .email,
        .nickname {
          color: #3a3a3a;
        }
        .myname,
        .myemail,
        .mynickname {
          color: #707070;
        }
        .name,
        .email,
        .nickname {
          width: 5rem;
          padding-right: 1.5rem;
        }
      }
      .nickname-edit-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        padding-top: 1rem;
        .nickname-edit-button {
          display: flex;
          flex-direction: row;
          border-bottom: solid #727272 1px;
          padding-bottom: 0.1rem;
          .edit-img {
            width: 1.2rem;
            padding-right: 0.2rem;
          }
          .edit-nickname {
            text-align: center;
          }
        }
      }
    }
  }

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(#000, 0.7);
    }

    .input-box {
      background-color: #fff;
      padding: 1rem;
      z-index: 1;
      border-radius: r(3);
    }
  }
}
</style>
