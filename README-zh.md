

<div align=center>
    <h1>
        Vue-egg-jwt-template 
    </h1>
    <img src="https://img.shields.io/github/stars/yesmore/vue-egg-jwt-template.svg" alt="star"/>
    <img src="https://img.shields.io/github/package-json/v/yesmore/vue-egg-jwt-template" alt="star"/>
    <img src="https://img.shields.io/github/issues/yesmore/vue-egg-jwt-template" alt="star"/><br>
     <img src="https://img.shields.io/github/license/yesmore/vue-egg-jwt-template" alt="star"/>
</div>

---

阅读文档：[中文版](https://github.com/yesmore/vue-egg-jwt-template/blob/main/README-zh.md) | [English](https://github.com/yesmore/vue-egg-jwt-template)

> 简介：开箱即用的 User authentication template——用户权鉴模板。
>
> 适用人群：
>
> - 前端开发学习**egg**框架初学者
> - 使用 **Vue-egg** 架构的开发者
> - 或者像 [@yesmore](https://github.com/yesmore/) 这样又菜又懒的**CV**工程师

## 快速开始

```bash
# Clone git repo
$ git clone

# Install project
$ cd vue-egg-jwt-template
$ npm i
# Start Front-end
$ npm run dev

$ cd egg-server
$ npm i
# Start Front-end
$ npm run dev
```

登录页：

- http://localhost:8081/#/login

Api参考：

- http://localhost:7001/jwtlogin
- http://localhost:7001/jwtmsg
- ...

## 模块

#### 版本

Vue：**2.5.2**

egg：**2.15.1**

egg-jwt：**3.1.7**

mysql2：**2.3.0**

#### 交互模型

**前端** — (**http请求**) — **Contorller** — (**service**) — **MySQL** 

#### 主要逻辑

- 用户登陆校验（**Jwt**） `app/controller/jwt.js`

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

- 注册用户 `app/controller/jwt.js`

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

- 加密：**md5**（crypto）`app/service/user.js`

```js
// md5 encryption
getMd5Data(pwd) {
    return crypto.createHash('md5').update(pwd).digest('hex');
}
```

- 请求校验中间件：**checktoken** `app/middleware/checktoken`

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

- 持久化存储：**MySQL**（sequelize）`config/config.default.js`

```js
// Connect your db(MySQL)
config.sequelize = {
    dialect: 'mysql',
    database: 'jwttemplate',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    timezone: '+8:00',
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

**用户模型**

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

**组模型**

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



## 配置

#### ESLint for Vue

此模板默认开启**ESlint**，如果你需要关闭，可以执行下面的操作：

> config文件夹下的index.js文件中找到useEslint，并改成false

```js
// Use Eslint Loader?
// If true, your code will be linted during bundling and
// linting errors and warnings will be shown in the console.
useEslint: true,
```

## License

MIT