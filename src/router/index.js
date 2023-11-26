// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'

const routes = [
  {
    path: '/login',
    component: () => import('@/layouts/default/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
      },
      {
        path: '/twofa',
        name: 'TwoFA',
        component: () => import('@/views/TwoFA.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/HomeView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'domains',
        name: 'DomainList',
        component: () => import('@/views/domains/DomainsView.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: 'domains/:id',
        name: 'DomainDetail',
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: 'domains/:id/edit',
        name: 'DomainEdit',
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/imap_migration/migrations',
        name: 'MigrationsList',
        meta: {
          requiresAuth: true,
          allowedRoles: ['Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/imap_migration/providers',
        name: 'ProvidersList',
        meta: {
          requiresAuth: true,
          allowedRoles: ['Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/imap_migration/providers/:id/edit',
        name: 'ProviderEdit',
        meta: {
          requiresAuth: true,
          allowedRoles: ['Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/identities',
        name: 'Identities',
        component: () => import('@/views/identities/IdentitiesView.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/identities/accounts/:id',
        name: 'AccountDetail',
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/identities/accounts/:id/edit',
        name: 'AccountEdit',
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/identities/aliases/:id',
        name: 'AliasDetail',
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/identities/aliases/:id/edit',
        name: 'AliasEdit',
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
        },
      },
      {
        path: '/parameters/:app',
        name: 'ParametersEdit',
        meta: {
          requiresAuth: true,
          allowedRoles: ['SuperAdmins'],
        },
      },
      {
        path: '/alarms',
        name: 'Alarms',
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/monitoring/statistics',
        name: 'Statistics',
        meta: {
          requiresAuth: true,
          allowedRoles: ['SuperAdmins'],
        },
      },
      {
        path: '/monitoring/audit_trail',
        name: 'AuditTrail',
        meta: {
          requiresAuth: true,
          allowedRoles: ['SuperAdmins'],
        },
      },
      {
        path: '/monitoring/messages',
        name: 'MessageLog',
        meta: {
          requiresAuth: true,
          allowedRoles: ['DomainAdmins', 'SuperAdmins'],
        },
      },
      {
        path: '/information',
        name: 'Information',
        meta: {
          requiresAuth: true,
          allowedRoles: ['SuperAdmins'],
        },
      },
      {
        path: '/password_recovery',
        name: 'PasswordRecoveryForm',
      },
      {
        path: '/password_recovery/confirm/:id?/:token?/',
        name: 'PasswordRecoveryChangeForm',
      },
      {
        path: '/password_recovery/sms_confirm',
        name: 'PasswordRecoverySms',
      },
    ],
  },
  {
    path: '/user',
    component: () => import('@/layouts/default/DefaultLayout.vue'),
    children: [
      {
        path: 'api',
        name: 'APISetup',
        meta: {
          requiresAuth: true,
          allowedRoles: ['SuperAdmins'],
        },
      },
      {
        path: 'profile',
        name: 'UserProfile',
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'security',
        name: 'UserSecurity',
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'forward',
        name: 'UserForward',
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: { name: 'Dashboard' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth !== undefined) {
    const authStore = useAuthStore()
    authStore.initialize().then(() => {
      if (!authStore.isAuthenticated) {
        next({ name: 'Login' })
      } else {
        /*
        if (to.meta.allowedRoles !== undefined) {
          if (to.meta.allowedRoles.indexOf(authStore.authUser.role) === -1) {
            next({ name: 'Dashboard' })
            return
          }
        }*/
        next()
      }
    })
  } else {
    next()
  }
})

export default router
