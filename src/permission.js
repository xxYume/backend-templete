import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // getToken from cookie

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  return true
}

const whiteList = ['/login', '/authredirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress

  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else {
      // if (!store.getters.initRoute) {
      //   const role = getRole()
      //   console.log('角色是啥' + role);

      // }
      // const role = getRole()
      const role = 'superAdmin'
      if (hasPermission(role, to.meta.role)) {
        next() //
      } else {
        next({
          path: '/401',
          query: {
            noGoBack: true
          }
        })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
