import { createRouter, createWebHistory } from "vue-router";

import TrustList from "@/views/trust/list.vue";
import TrustAddOne from "@/views/trust/addStepOne.vue";
import TrustAddTwo from "@/views/trust/addStepTwo.vue";
import TrustAddThree from "@/views/trust/addStepTh.vue";
import TrustDetail from "@/views/trust/detail.vue";

import TaskList from "@/views/task/list.vue";
import TaskCreate from "@/views/task/create.vue";
import TaskDetail from "@/views/task/detail.vue";

import QcList from "@/views/qc/list.vue";
import QcCreate from "@/views/qc/create.vue";
import QcDetail from "@/views/qc/detail.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: TrustList,
    },
    {
      path: "/trust-add-one",
      name: "TrustAddOne",
      component: TrustAddOne,
    },
    {
      path: "/trust-add-two",
      name: "TrustAddTwo",
      component: TrustAddTwo,
    },
    {
      path: "/trust-add-three",
      name: "TrustAddThree",
      component: TrustAddThree,
    },
    {
      path: "/trust-detail/:id",
      name: "TrustDetail",
      component: TrustDetail,
    },
    {
      path: "/task-create/:id",
      name: "TaskCreate",
      component: TaskCreate,
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
  ],
});

export default router;
