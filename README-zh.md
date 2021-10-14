<div align=center>
    <h1>VuEgg-jwt-template</h1>
    <img src="https://img.shields.io/github/stars/yesmore/vue-egg-jwt-template.svg" alt="star"/>
    <img src="https://img.shields.io/github/package-json/v/yesmore/vue-egg-jwt-template" alt="star"/>
    <img src="https://img.shields.io/github/issues/yesmore/vue-egg-jwt-template" alt="star"/><br>
     <img src="https://img.shields.io/github/license/yesmore/vue-egg-jwt-template" alt="star"/>
</div>



---

**Reading documents**: [中文版](https://github.com/yesmore/vue-egg-jwt-template/blob/main/README-zh.md) | English

> Introduction: out of the box user authentication template - user authentication template
>
> intended for：
>
> - Front end development learning **egg** framework for beginners
> - Developers using **Vue & egg** architecture
> - Or like [@yesmore]( https://github.com/yesmore/) such a lazy **CV** coder

## Update logs

- 1.1.1

  ...



## Quick start

Before start, make sure you have the following environment：

- Nodejs
- Npm
- MySQL 5.7.x
- git

### Clone git repo

```bash
# git bash
$ git clone git@github.com:yesmore/vue-egg-jwt-template.git
# or http
$ git clone https://github.com/yesmore/vue-egg-jwt-template.git
# or release

```

### Install & Start

```bash
# It is recommended to start the background first
$ cd egg-server
$ npm i
# Start Back-end
$ npm run dev

$ cd vue-egg-jwt-template
$ npm i
# Start Front-end
$ npm run dev
```

Login page：

- http://localhost:8081/#/login
- ...

Api url：

- http://localhost:7001/jwtlogin
- http://localhost:7001/jwtmsg
- http://localhost:7001/init
- ...



## Developer notes

This project is based on：

- Front-end frame：**Vue 2.5.2**

- Back-end frame：**Eggjs 2.15.1**

- DataBase：**MySQL 2.3.0**

### File directory

```js
|- egg-server/
	|- app/
		|- controller/
		|- middleware/
		|- model/
		|- service/
		|- view/
		|- router.js
	|- config/
		|- config.default.js
		|- plugin.js
	|- test/
	|- app.js
	|- package.json
	|- ...

|- vue-egg-jwt-template/
	|- build/
	|- config/
		|- dev.env.js
		|- index.js
		|- prod.env.js
	|- src/
		|- assets/
		|- router/
		|- utils/
		|- views/
		|- App.vue
		|- main.js
	|- static/
	|- package.json
	|- ...
```

### Interaction Model

**Front-end** — (**http**) — **Contorller** — (**service**) — **Database** 

### Main logic

- **User login verification**（**Jwt**） 

`app/controller/jwt.js`

```js
// method: Post
// Url: http://127.0.0.1:7001/jwtlogin
// body: { user:{ username, password } }
async doLogin() {
    let { ctx } = this;
    try {
        // 1.Get user-info: username & password
        let user = ctx.request.body.user;

        let doUser = await ctx.service.user.getUserByName(user.username);
        // 2.Check for correctness
        let oldPsw = await ctx.service.user.getMd5Data(user.password)
        // Compare the password between web and database
        if(doUser && (oldPsw === doUser.password)) {
            let user_jwt = { 
                username: user.username,
                password: user.password
            };
            // 2.1.Generate token with your user-info & your secret
            let token =  this.app.jwt.sign(user_jwt, this.app.config.jwt.secret);
            ctx.body = {
                token: token,
                status: 200 
            };
        } else {
            // 2.2.or return error
            ctx.body = {
                msg: 'Permission verification error! please input correct username or password.',
                status: 401 
            };
        }
    } catch (e) {
        ctx.body = {
            msg: 'Server error',
            status: 501
        }
    }
}
```

- **Registered user**

 `app/controller/jwt.js`

```js
// method: Post
// Url: http://127.0.0.1:7001/jwtregister
// body: { user:{ username, password, group_id } }
async doRegister() {
    let { ctx } = this;
    try {
        // 1.Get user-info: username & password
        let { user } = ctx.request.body;
        let { username, password, group_id } = user
        let doUser = await ctx.service.user.getUserByName(username);
        // 2.Check for correctness
        if(!doUser) {
            let res = await ctx.service.user.createUser(username, password, group_id)
            if(res) {
                ctx.body = {
                    msg: 'User created successfully.',
                    status: 200
                }
            } else {
                ctx.body = {
                    msg: 'User created failed.',
                    status: 402
                }
            } 
        } else {
            // 2.2.or return error
            ctx.body = {
                msg: 'User already exists.',
                status: 401 
            };
        }
    } catch (e) {
        ctx.body = {
            msg: 'Server error',
            status: 501
        }
    }
}
```

- **Encryption**：**md5**（crypto）

`app/service/user.js`

```js
// md5 encryption
getMd5Data(pwd) {
    return crypto.createHash('md5').update(pwd).digest('hex');
}
```

- **Request verification Middleware**

 `app/middleware/checktoken`

```js
/**
 * Token verification Middleware
 */
checktoken = () => {
  return async (ctx, next) => {
    try {
      // 1.Get token
      let token = ctx.request.header.token;
      // 2.Verify token
      let decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      if(decode.username && decode.password) {
        await next();
      } else {
        ctx.body = {
          msg: 'Jwt verification failed',
          status: 400
        }
      }
    } catch (e) {
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }
};
```

- **Persistent storage**：**MySQL**

`config/config.default.js`

```js
// Connect your db(MySQL)
config.sequelize = {
    dialect: 'mysql',
    database: 'jwttemplate',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '****',
    timezone: '+08:00',
}
```

`config/plugin.js`

```js
sequelize: {
    enable: true,
    package: 'egg-sequelize'
}
```

`projectname/app.js`

```js
/**
 * Create db(MySQL) tables
 *  You can understand it as a life cycle
 */
module.exports = app => {
  app.beforeStart(async () => {
    // Be careful: for Dev Environment - Clear db tables after restart server if you set [force] as true!
    // await app.model.sync({ force: true }); 
    // sync：Create tables from models（/app/model/...）
    await app.model.sync({})
  })
}
```



**User model**

```js
/**
 * User model
 *  id: STRING
 *  username: STRING,
 *  password: STRING,
 *  group_id: STRING,
 *  created_at: STRING,
 *  updated_at: STRING
 */
module.exports = app => {
  const { STRING } = app.Sequelize;
  // Serialize converts the first parameter (model name) of define to plural by default
  // Sequelize默认将define的第一个参数（模型名称）转为复数
  const User = app.model.define('user', {
    username: STRING,
    password: STRING
  });
  // user's Group: Primary key pointing to group
  // 主键指向组
  User.associate = () => {
    app.model.User.belongsTo(app.model.Group, {
      foreignKey: 'group_id',
      as: 'group'
    })
  }

  return User
}

```

**Group model**

```js
/**
 * Group model
 *  id: STRING
 *  groupname: STRING,
 *  created_at: STRING,
 *  updated_at: STRING
 */
module.exports = app => {
  const { STRING } = app.Sequelize;
  const Group = app.model.define('group', {
    groupname: STRING,
  });

  return Group
}

```



## Other Configurations

### ESLint for Vue

This template is enabled by default **eslint**. If you need to close it, you can do the following:

> Find **useEslint** in the index.js file under the **config** folder and change it to **false**.

```js
// Use Eslint Loader?
// If true, your code will be linted during bundling and
// linting errors and warnings will be shown in the console.
useEslint: true,
```

### Axios for Vue

I encapsulated a `request` tool module as an independent **HTTP** request module, which is located in **vue/src/utils/request.js**; Then, it is introduced globally in **vue/main.js** and **registered** on the Vue prototype; And set the development global variable API of **baseURL** in **vue/config/dev.env.js** file— **API_ROOT** 。 In this way, **HTTP** requests can be sent on all pages using the `request` module.

```js
// request.js
import axios from 'axios'

const request = axios.create({
  baseURL: process.env.API_ROOT // config/
})

// Set the interceptor to carry the token every request
request.interceptors.request.use((req) => {
  let token = localStorage.getItem('token')
  if (token) {
    req.headers.token = token
  }
  return req
})

export default request
```

```js
// main.js
import request from './utils/request.js'

Vue.prototype.$http = request
```

**Development options**

```js
// vue/config/dev.env.js
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://127.0.0.1:7001"'
})
```

**Production options**

```js
// vue/config/prod.env.js
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: '"http://aoau.top:7001"' // Your server address
}
```



```js
// Login.vue
this.$http.post('/jwtlogin', { postData })
```

If you do not need to register the request module globally, you can comment out the introduction statement in **Vue/main. JS** and introduce it on the page you need.

```js
// main.js
import Vue from 'vue'
import App from './App'
import router from './router'
// import request from './utils/request.js'

Vue.config.productionTip = false

// Vue.prototype.$http = request

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

```

```js
// Login.vue
<script>
  import request from '../utils/request.js
  export default {
    data () {
      return {
        data: ''
      }
    },
	methods: {
      async fetchDate () {
        let res = await request.get('/jwtmsg')
        this.data = res.data
      }
    }
  }
</script>
```

## License

MIT

