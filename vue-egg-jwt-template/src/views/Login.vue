<template>
  <div id="login">
    <h1>Please enter user info to sign in</h1>
    <h3>For more demo, please visit <a href="https://github.com/yesmore">https://github.com/yesmore</a> .</h3>
    <form @submit.prevent="doLogin">
      <input v-model="user.username" placeholder="Enter username" type="text">
      <input v-model="user.password" placeholder="Enter password" type="password">
      <button>Login</button>
    </form>
    <button @click="$router.push('register')">Register</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  created () {},
  methods: {
    doLogin () {
      if (this.user.username !== '' && this.user.password !== '') {
        this.$http.post('/jwtlogin', { user: this.user })
          .then(res => {
            if (res.data.status === 200) {
              localStorage.setItem('token', res.data.token) // Store locally
              this.$router.push('/')
            } else {
              console.log('Permission verification error! please input correct username or password.')
            }
          })
      }
    }
  }
}
</script>

<style>
  #login {
    margin: 100px auto;
    text-align: center;
    padding: 20px 0px;
    width: 500px;
  }

  input[type=text], input[type=password] {
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 5px;
  }

  /* Set a style for all buttons */
  button {
    background-color: #2EA650;
    color: #FFFFFF;
    font-size: 20px;
    padding: 10px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 50%;
    font-weight: 700;
    font-family: inherit;
  }

  button:hover {
    opacity: 0.8;
  }
</style>
