<template>
  <div id="login">
    <h1>Register a new account</h1>
    <h3>For more demo, please visit <a href="https://github.com/yesmore">https://github.com/yesmore</a> .</h3>
    <form @submit.prevent="doRegister">
      <input v-model="user.username" placeholder="Enter username" type="text">
      <input v-model="user.password" placeholder="Enter password" type="password">
      <input v-model="user.group_id" placeholder="Choose group" type="text">
      <button>Register</button>
    </form>
    <button @click="$router.go(-1)">Back</button>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      user: {
        username: '',
        password: '',
        group_id: ''
      }
    }
  },
  created () {},
  methods: {
    doRegister () {
      if (this.user.username !== '' && this.user.password !== '' && this.user.group_id !== '') {
        this.$http.post('/jwtregister', { user: this.user })
          .then(res => {
            if (res.data.status === 200) {
              this.$router.push('/login')
            } else {
              console.log('Registe error')
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
