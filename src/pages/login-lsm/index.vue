<template>
  <div id="login-page">
    <div class="login-box">
      <img src="~/assets/images/logo-with-text.svg" class="logo-container" />
      <div class="login-info-wrapper">
        <div class="login-container">
          <div class="login-input-container">
            <input class="lic-id" type="text" placeholder="아이디" />
            <input class="lic-pw" type="password" placeholder="비밀번호" />
          </div>
          <button class="login-btn">
            로그인
          </button>
        </div>
        <NuxtLink to="/register" class="register-link">
          회원가입
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-box {
    width: 100%;
    align-items: center;
    justify-content: center;

    .logo-container {
      width: 60%;
      height: auto;
      display: block;
      margin: auto;
      max-width: 20rem;
    }

    .login-info-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 3rem;
      width: 60%;
      margin: auto;
      max-width: 20rem;

      .login-container {
        display: flex;
        flex-direction: row;
        width: 100%;

        .login-input-container {
          display: flex;
          flex-direction: column;
          width: 70%;
          padding-left: 0.5rem;
          margin-top: 2rem;

          .lic-id {
            align-items: center;
            border: none;
            border-bottom: 1px solid #7c7b7b;
            width: 100%;
            padding: 0.6rem;
          }

          .lic-pw {
            margin-top: 0.6rem;
            align-items: center;
            border: none;
            border-bottom: 1px solid #7c7b7b;
            padding: 0.6rem;
            width: 100%;
          }
        }

        .login-btn {
          margin-left: 2.5rem;
          margin-top: 2rem;
          width: 30%;
        }
      }
    }

    .register-link {
      display: block;
      width: 100%;
      text-align: left;
      margin-top: 1.3rem;
      margin-left: 2rem;
      color: hsl(256, 53%, 16%);
      font-size: 0.8rem;
      min-width: 100%;
    }
  }
}
</style>
