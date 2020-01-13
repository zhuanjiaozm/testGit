import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import testdev from '@/components/testdev'
import hello from '@/components/hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/testdev',
      name: 'testdev',
      component: testdev
    },
    {
      path: '/hello',
      name: 'hello',
      component: hello
    }
  ]
})
