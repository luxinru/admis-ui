import { createWebHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: "/path",
    component: () => import('@/views/error/path'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/add',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detail',
        component: () => import('@/views/assets/real/add/apply/detail/index'),
        name: 'addApplyDetail',
        meta: { title: '资产增加申请明细', icon: '' }
      }
    ]
  }, {
    path: '/add',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'audit/detail',
        component: () => import('@/views/assets/real/add/audit/detail/index'),
        name: 'addAuditDetail',
        meta: { title: '资产增加审批明细', icon: '' }
      }
    ]
  }, {
    path: '/add',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'query/detail',
        component: () => import('@/views/assets/real/add/query/detail/index'),
        name: 'addQueryDetail',
        meta: { title: '资产增加查询明细', icon: '' }
      }
    ]
  },
  {
    path: '/adjust',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detail',
        component: () => import('@/views/assets/real/adjust/apply/detail/index'),
        name: 'adjustApplyDetail',
        meta: { title: '资产变更申请明细', icon: '' }
      }
    ]
  }, {
    path: '/adjust',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'audit/detail',
        component: () => import('@/views/assets/real/adjust/audit/detail/index'),
        name: 'adjustAuditDetail',
        meta: { title: '资产变更审批明细', icon: '' }
      }
    ]
  }, {
    path: '/adjust',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'query/detail',
        component: () => import('@/views/assets/real/adjust/query/detail/index'),
        name: 'adjustQueryDetail',
        meta: { title: '资产变更查询明细', icon: '' }
      }
    ]
  },
  {
    path: '/less',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detail',
        component: () => import('@/views/assets/real/less/apply/detail/index'),
        name: 'lessApplyDetail',
        meta: { title: '资产减少申请明细', icon: '' }
      }
    ]
  },
  {
    path: '/less',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'audit/detail',
        component: () => import('@/views/assets/real/less/audit/detail/index'),
        name: 'lessAuditDetail',
        meta: { title: '资产减少审批明细', icon: '' }
      }
    ]
  },
  {
    path: '/less',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'query/detail',
        component: () => import('@/views/assets/real/less/query/detail/index'),
        name: 'lessQueryDetail',
        meta: { title: '资产减少查询明细', icon: '' }
      }
    ]
  },
  {
    path: '/rent',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detail',
        component: () => import('@/views/assets/rent/apply/detail/index'),
        name: 'rentApplyDetail',
        meta: { title: '出租申请明细', icon: '' }
      }
    ]
  },
  {
    path: '/rent',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/detail',
        component: () => import('@/views/assets/rent/edit/detail/index'),
        name: 'rentEditDetail',
        meta: { title: '出租合同维护明细', icon: '' }
      }
    ]
  },
  {
    path: '/rent',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'adjust/detail',
        component: () => import('@/views/assets/rent/adjust/detail/index'),
        name: 'rentAdjustDetail',
        meta: { title: '出租合同变更明细', icon: '' }
      }
    ]
  },
  {
    path: '/rent',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'audit/detail',
        component: () => import('@/views/assets/rent/audit/detail/index'),
        name: 'rentAuditDetail',
        meta: { title: '出租合同审批明细', icon: '' }
      }
    ]
  },
  {
    path: '/rent',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'query/detail',
        component: () => import('@/views/assets/rent/query/detail/index'),
        name: 'rentQueryDetail',
        meta: { title: '出租合同变更查询明细', icon: '' }
      }
    ]
  },
  {
    path: '/refine',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detail',
        component: () => import('@/views/assets/house/refine/apply/detail/index'),
        name: 'refineApplyDetail',
        meta: { title: '房屋细化申请明细', icon: '' }
      }
    ]
  }, {
    path: '/refine',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detailshow',
        component: () => import('@/views/assets/house/refine/apply/detail/indexShow'),
        name: 'refineApplyDetailShow',
        meta: { title: '房屋细化申请明细', icon: '' }
      }
    ]
  }, {
    path: '/refine',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'audit/detailsend',
        component: () => import('@/views/assets/house/refine/audit/detail/index'),
        name: 'refineAuditDetail',
        meta: { title: '房屋细化审批明细', icon: '' }
      }
    ]
  }, {
    path: '/refine',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'query/detailsearch',
        component: () => import('@/views/assets/house/refine/query/detail/index'),
        name: 'refineQueryDetail',
        meta: { title: '房屋细化查询明细', icon: '' }
      }
    ]
  }, {
    path: '/repair',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detail',
        component: () => import('@/views/assets/house/repair/apply/detail/index'),
        name: 'repairApplyDetail',
        meta: { title: '房屋维修申请明细', icon: '' }
      }
    ]
  }, {
    path: '/repair',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'apply/detailshow',
        component: () => import('@/views/assets/house/repair/apply/detail/indexShow'),
        name: 'repairApplyDetailShow',
        meta: { title: '房屋维修申请明细', icon: '' }
      }
    ]
  }, {
    path: '/repair',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'audit/detailsend',
        component: () => import('@/views/assets/house/repair/audit/detail/index'),
        name: 'repairAuditDetailSend',
        meta: { title: '房屋维修审批明细', icon: '' }
      }
    ]
  }, {
    path: '/repair',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'implementation/detailImplementation',
        component: () => import('@/views/assets/house/repair/implementation/detail/index'),
        name: 'repairImplementationDetailImplementation',
        meta: { title: '房屋维修实施明细', icon: '' }
      }
    ]
  }, {
    path: '/repair',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'implementation/detailsearch',
        component: () => import('@/views/assets/house/repair/query/detail/index'),
        name: 'repairImplementationDetailSearch',
        meta: { title: '房屋维修查询明细', icon: '' }
      }
    ]
  },
  {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/entry/detail',
        component: () => import('@/views/value/add/entry/detail/index'),
        name: 'adpVarassetsdetailAdd',
        meta: { title: '入账申请单据明细', icon: '' }
      },
      {
        path: 'add/entry/preview',
        component: () => import('@/views/value/add/entry/preview/index'),
        name: 'adpVarassetsdetailAddPreview',
        meta: { title: '入账申请单据明细预览', icon: '' }
      }
    ]
  },
  {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/financeCheck/detail',
        component: () => import('@/views/value/add/financeCheck/detail/index'),
        name: 'adpVarassetsdetailFinanceCheck',
        meta: { title: '财务核对单据明细', icon: '' }
      }
    ]
  },
  {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/realCheck/detail',
        component: () => import('@/views/value/add/realCheck/detail/index'),
        name: 'adpVarassetsdetailRealCheck',
        meta: { title: '实物核对单据明细', icon: '' }
      }
    ]
  },
  {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/confirm/detail',
        component: () => import('@/views/value/add/confirm/detail/index'),
        name: 'adpVarassetsdetailConfirm',
        meta: { title: '使用状态确认单据明细', icon: '' }
      }
    ]
  }, {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/physical/detail',
        component: () => import('@/views/value/add/physical/detail/index'),
        name: 'adpVarassetsdetailPhysical',
        meta: { title: '实物信息维护明细', icon: '' }
      }
    ]
  }, {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/goodsCheck/detail',
        component: () => import('@/views/value/add/goodsCheck/detail/index'),
        name: 'adpVarassetsdetailGoodsCheck',
        meta: { title: '物资核对单据明细', icon: '' }
      }
    ]
  }, {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/buildCostCheck/detail',
        component: () => import('@/views/value/add/buildCostCheck/detail/index'),
        name: 'adpVarassetsdetailBuildCheck',
        meta: { title: '造价核对单据明细', icon: '' }
      }
    ]
  }, {
    path: '/value',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add/financial/detail',
        component: () => import('@/views/value/add/financial/detail/index'),
        name: 'adpVarassetsdetailFinancial',
        meta: { title: '财务信息维护明细', icon: '' }
      }
    ]
  }, {
  path: '/value',
      component: Layout,
      hidden: true,
      children: [
        {
            path: 'add/assetsaudit/detail',
            component: () => import('@/views/value/add/assetsaudit/detail/index'),
            name: 'adpVarassetsdetailAssetsaudit',
            meta: { title: '资产增加审批明细', icon: '' }
        }
      ]
  }, {
  path: '/value',
      component: Layout,
      hidden: true,
      children: [
      {
          path: 'add/assetsquery/detail',
          component: () => import('@/views/value/add/assetsquery/detail/index'),
          name: 'adpVarassetsdetailAssetsquery',
          meta: { title: '资产增加查询明细', icon: '' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      },
      {
        path: 'dept/',
        component: () => import('@/views/system/user/grantDept'),
        name: 'ExtraUser',
        meta: { title: '关联单位', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  },
  {
    path: '/screen/house',
    hidden: true,
    permissions: ['tool:gen:edit'],
    component: () => import('@/views/screen/house/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;
