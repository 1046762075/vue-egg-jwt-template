<template>
  <div
    class="zq-drop-list"
    @mouseover="onDplOver($event)"
    @mouseout="onDplOut($event)"
  >
    <span>{{ isClick ? dplLable : '请选择用户权限' }}<i></i></span>
    <ul v-dpl>
      <li
        v-for="(item, index) in dataList"
        :key="index"
        @click="onLiClick(index, $event)"
      >
        {{ item[labelProperty] }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DropDownList',
  data () {
    return {
      activeIndex: 0,
      isOn: false,
      isLeave: false,
      isClick: false
    }
  },
  props: {
    dataList: {
      type: Array,
      default () {
        return [{ groupname: '选项一' }, { groupname: '选项二' }]
      }
    },
    labelProperty: {
      type: String,
      default () {
        return 'groupname'
      }
    }
  },
  directives: {
    dpl: {
      bind (el) {
        el.style.display = 'none'
      }
    }
  },
  methods: {
    onDplOver (event) {
      let ul = event.currentTarget.childNodes[2]
      ul.style.display = 'block'
    },
    onDplOut (event) {
      let ul = event.currentTarget.childNodes[2]
      ul.style.display = 'none'
    },
    onLiClick (index) {
      this.isClick = true
      let path = event.path || (event.composedPath && event.composedPath()) // 兼容火狐和safari
      path[1].style.display = 'none'
      this.activeIndex = index
      this.$emit('change', {
        index: index,
        value: this.dataList[index].id
      })
    }
  },
  computed: {
    dplLable () {
      return this.dataList[this.activeIndex][this.labelProperty]
    }
  }
}
</script>

<style scoped>
.zq-drop-list {
  display: block;
  width: 50%;
  margin: 10px auto;
  position: relative;
  border: 1px solid rgba(128, 128, 128, 0.192);
  border-radius: 4px;
}
.zq-drop-list span {
  display: block;
  height: 40px;
  line-height: 40px;
  background: #f1f1f1;
  font-size: 14px;
  text-align: center;
  color: #333333;
  border-radius: 4px;
}
.zq-drop-list span i {
  display: inline-block;
}
/* .zq-drop-list span i::after {
  content: '∨';
  font-weight: 600;
} */
.zq-drop-list ul {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: solid 1px #f1f1f1;
  border-radius: 4px;
  overflow: hidden;
}
.zq-drop-list ul li {
  list-style: none;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border-bottom: solid 1px #f1f1f1;
  background: #ffffff;
}
.zq-drop-list ul li:last-child {
  border-bottom: none;
}
.zq-drop-list ul li:hover {
  background: #f6f6f6;
}
</style>
