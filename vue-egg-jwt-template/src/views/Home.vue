<template>
  <div id="home">
    <h1>Hello VuEgg-jwt-template App</h1>
    <h3>For more demo, please visit <a href="https://github.com/yesmore">https://github.com/yesmore</a> .</h3>
    <button @click="$router.push('login') ">Login</button>
    <button @click="logout">Logout</button>
    <hr>
    <button @click="getMsg">
      <span v-if="data !== ''"> {{ data }} </span>
      <code v-else>Try touch</code>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      data: ''
    }
  },
  methods: {
    // test
    async getMsg () {
      // Request with token
      let res = await this.$http.get('/jwtmsg')
      this.data = res.data
    },
    logout () {
      localStorage.setItem('token', '')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
  #home {
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
    transition: 0.3s;
  }

  button:hover {
    opacity: 0.8;
  }

  span {
    font-size: 15px;
  }
</style>
