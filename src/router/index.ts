import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/login.vue";

import TrustList from "@/views/trust/list.vue";
import TrustAddOne from "@/views/trust/addStepOne.vue";
import TrustAddTwo from "@/views/trust/addStepTwo.vue";
import TrustAddThree from "@/views/trust/addStepTh.vue";
import TrustDetail from "@/views/trust/detail.vue";

import TaskList from "@/views/task/list.vue";
import TaskCreate from "@/views/task/create.vue";
import TaskDetail from "@/views/task/detail.vue";
import TaskEdit from "@/views/task/edit.vue";

import QcList from "@/views/qc/list.vue";
import QcCreate from "@/views/qc/create.vue";
import QcDetail from "@/views/qc/detail.vue";

import TrustEdit from "@/views/trust/edit.vue";
import TrustEditTwo from "@/views/trust/editTwo.vue";

const getBase = () => {
  const path = window.location.pathname
  
  if (path.includes('/mfe/commission')) return '/mfe/commission/1'
  if (path.includes('/mfe/task')) return '/mfe/task/1'
  if (path.includes('/mfe/qc')) return '/mfe/qc/1'
  return '/mfe/commission/1'
}

const router = createRouter({
  history: createWebHistory(getBase()),
  routes: [
    {
      path: '/:pathMatch(.*)*',  // 捕获所有路由
      redirect: () => {
        const path = window.location.pathname
        
        // 处理带有 index.html 的情况
        if (path.endsWith('index.html')) {
          if (path.includes('/mfe/commission')) return '/trust-list'
          if (path.includes('/mfe/task')) return '/task-list'
          if (path.includes('/mfe/qc')) return '/qc-list'
        }
        
        // 处理直接访问基础路径的情况
        if (path.includes('/mfe/commission')) return '/trust-list'
        if (path.includes('/mfe/task')) return '/task-list'
        if (path.includes('/mfe/qc')) return '/qc-list'
        
        return '/trust-list'
      }
    },
    {
      path: "/trust-list",
      name: "TrustList",
      component: TrustList,
    },
    {
      path: "/trust-add-one/:id?",
      name: "TrustAddOne",
      component: TrustAddOne,
    },
    {
      path: "/trust-add-two/:id?",
      name: "TrustAddTwo",
      component: TrustAddTwo,
    },
    {
      path: "/trust-add-three/:id?",
      name: "TrustAddThree",
      component: TrustAddThree,
    },
    {
      path: "/trust-detail/:id",
      name: "TrustDetail",
      component: TrustDetail,
    },
    {
      path: "/task-create/:orderId?",
      name: "TaskCreate",
      component: TaskCreate,
    },
    {
      path: "/task-edit/:id",
      name: "TaskEdit",
      component: () => import('@/views/task/edit.vue'),
    },
    {
      path: "/task-list",
      name: "TaskList",
      component: TaskList,
    },
    {
      path: "/task-detail/:id",
      name: "TaskDetail",
      component: TaskDetail,
    },
    {
      path: "/qc-list",
      name: "QcList",
      component: QcList,
    },
    {
      path: "/qc-create/:taskId/:orderId",
      name: "QcCreate",
      component: QcCreate,
    },
    {
      path: "/qc-detail/:id",
      name: "QcDetail",
      component: QcDetail,
    },
    {
      path: '/trust-edit/:id',
      name: 'TrustEdit',
      component: () => import('@/views/trust/edit.vue')
    },
    {
      path: '/trust-edit-two/:id',
      name: 'TrustEditTwo',
      component: () => import('@/views/trust/editTwo.vue')
    },
    {
      path: '/qc-edit/:id/:taskId/:orderId',
      name: 'qc-edit',
      component: () => import('../views/qc/edit.vue')
    },
  ],
});

export default router;
