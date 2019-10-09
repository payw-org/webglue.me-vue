<template>
  <div class="register-page">
    <div class="register-box">
      <img src="~/assets/images/logo-with-text.svg" class="logo-container" />
      <div class="register-input-container">
        <input class="ric-id" type="text" placeholder="아이디" />
        <input
          class="ric-pw"
          type="password"
          placeholder="비밀번호"
          value="{password}"
          onChange="{handlePasswordChange}"
        />
        <div class="pw-check">
          <div class="cross-container">
            <div class="cross-left" />
            <div class="cross-right" />
          </div>
          <input
            class="ric-pw-check"
            type="password"
            placeholder="비밀번호 확인"
            value="{passwordConfirm}"
            onChange="{handlePasswordConfirmChange}"
          />
        </div>

        <button class="register-btn">
          회원가입
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.register-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .register-box {
    width: 70%;
    max-width: 20rem;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;

    .logo-container {
      width: 50%;
      margin-left: 1.6rem;
      height: auto;
      display: block;
      max-width: 10rem;
    }

    .register-input-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 1.5rem;

      .ric-id {
        width: 70%;
        margin-top: 1rem;
        border: none;
        border-bottom: 1px solid #7c7b7b;
        padding: 0.6rem;
      }

      .ric-pw {
        margin-top: 1.8rem;
        width: 70%;
        border: none;
        border-bottom: 1px solid #7c7b7b;
        padding: 0.6rem;
      }
      .pw-check {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 0.6rem;
        margin-top: 1.8rem;
        position: relative;

        .cross-container {
          position: absolute;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;

          .cross-left,
          .cross-right {
            width: 30%;
            height: 5px;
            position: absolute;
            background-color: red;
          }

          .cross-left {
            transform: rotate(45deg);
          }

          .cross-right {
            transform: rotate(-45deg);
          }
        }

        .ric-pw-check {
          width: 70%;
          border: none;
          border-bottom: 1px solid #7c7b7b;
        }
      }
    }
    .register-btn {
      width: 100%;
      max-width: 20rem;
      margin-top: 1.8rem;
      padding: 0.6rem;
    }
  }
}
</style>
