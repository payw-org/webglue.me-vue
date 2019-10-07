<template>
  <div class="login-page">
    <div class="login-box">
      <h1>webglue</h1>
      <div class="input-info-container">
        <input type="text" class="input-info input-id" placeholder="아이디" />
        <input
          type="password"
          class="input-info input-pw"
          placeholder="패스워드"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/scss/main';

.login-page {
  min-height: calc(100vh - 3rem);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .background-logo {
    position: fixed;
    top: 50%;
    left: 50%;
  }

  .login-box {
    z-index: 3;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: calc(100% - 3rem);
    max-width: 18rem;

    .input-info-container {
      width: 100%;
      display: flex;
      flex-direction: column;

      .input-info {
        z-index: 3;
        background-color: $base-white-blue;
        backdrop-filter: blur(30px) saturate(1.7);
        text-align: center;
        display: block;
        margin-bottom: s(2);
        padding: s(3) 0;
        border-radius: r(3);
        font-size: b(3);

        &:last-child {
          margin-bottom: 0;
        }

        &.input-id {
          border-radius: r(3) r(3) r(1) r(1);
        }

        &.input-pw {
          border-radius: r(1) r(1) r(3) r(3);
        }
      }
    }
  }
}
</style>
