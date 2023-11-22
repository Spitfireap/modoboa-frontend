<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    :color="mainColor"
    app
    dark
  >
    <div class="d-flex align-center">
      <v-img
        src="@/assets/Modoboa_RVB-BLANC-SANS.png"
        max-width="190"
        class="logo"
        @click="router.push({ name: 'Dashboard' })"
      />
      <v-btn icon @click.stop="rail = !rail">
        <v-icon
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        ></v-icon>
      </v-btn>
    </div>

    <v-list nav>
      <template v-for="item in menuItems">
        <v-list-item
          v-if="!item.children"
          :value="item"
          :to="item.to"
          link
          :key="item.text"
          :exact="item.exact"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
        <v-list-group v-else :value="item.text" :key="item.text">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item.text"
              color="white"
              :key="item.text"
              :prepend-icon="item.icon"
            >
            </v-list-item>
          </template>
          <v-list-item
            v-for="subitem in item.children"
            :key="subitem.text"
            :to="subitem.to"
            link
            :title="subitem.text"
            :value="subitem"
          ></v-list-item>
        </v-list-group>
      </template>
    </v-list>
    <template v-slot:append>
      <v-menu rounded="lg" offset-y top v-if="isAuthenticated">
        <template v-slot:activator="{ attrs, on }">
          <div
            class="d-flex user-box justify-center align-center white--text py-2"
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar size="40" color="primary">
              <span class="white--text headline">{{ userInitials }}</span>
            </v-avatar>
            <template v-if="!rail">
              <span class="mx-2">{{ displayName }}</span>
              <v-icon class="float-right">mdi-chevron-up</v-icon>
            </template>
          </div>
        </template>
        <v-list>
          <v-list-item
            v-for="item in userMenuItems"
            :key="item.text"
            :to="item.to"
            @click="item.click"
            link
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useGettext } from 'vue3-gettext'

import parameters from '@/api/parameters'
import { useAuthStore, useBusStore } from '@/stores'

const authStore = useAuthStore()
const busStore = useBusStore()
const route = useRoute()
const router = useRouter()
const { $gettext } = useGettext()

const rail = ref(false)
const drawer = ref(true)

const authUser = computed(() => authStore.authUser)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const userInitials = computed(() => {
  let initials = null
  if (authUser.value.first_name) {
    initials = authUser.value.first_name[0]
  }
  if (authUser.value.last_name) {
    initials = initials
      ? initials + authUser.value.last_name[0]
      : authUser.value.last_name[0]
  }
  if (!initials) {
    initials = authUser.value.username[0]
  }
  return initials
})
const displayName = computed(() => {
  return authUser.value.first_name || authUser.value.last_name
    ? `${authUser.value.first_name} ${authUser.value.last_name}`
    : authUser.value.username
})

const menuItems = computed(() => {
  if (route.meta.layout === 'user') {
    return userSettingsMenuItems
  }
  return mainMenuItems
})

const mainColor = computed(() => {
  if (route.meta.layout === 'user') {
    return 'grey'
  }
  return 'primary'
})

// created
parameters.getApplications().then((response) => {
  response.data.forEach((item) => {
    mainMenuItems[6].children.push({
      text: item.label,
      to: { name: 'ParametersEdit', params: { app: item.name } },
    })
  })
})

let imapMigration = computed(() => busStore.imapSettings)

parameters.getApplication('imap_migration').then((response) => {
  busStore.changeImapSettings(response.data.params.enabled_imapmigration)
})

const mainMenuItems = [
  {
    text: $gettext('Dashboard'),
    to: { name: 'Dashboard' },
    icon: 'mdi-view-dashboard-outline',
    exact: true,
  },
  {
    text: $gettext('Domains'),
    to: { name: 'DomainList' },
    icon: 'mdi-domain',
    roles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
  },
  {
    text: $gettext('Identities'),
    to: { name: 'Identities' },
    icon: 'mdi-account',
    roles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
  },
  {
    text: $gettext('Alarms'),
    to: { name: 'Alarms' },
    icon: 'mdi-bell',
  },
  {
    icon: 'mdi-history',
    text: $gettext('Monitoring'),
    roles: ['SuperAdmins', 'Resellers', 'DomainAdmins'],
    children: [
      {
        text: $gettext('Statistics'),
        to: { name: 'Statistics' },
        roles: ['SuperAdmins'],
      },
      {
        text: $gettext('Audit trail'),
        to: { name: 'AuditTrail' },
        roles: ['SuperAdmins'],
      },
      {
        text: $gettext('Messages'),
        to: { name: 'MessageLog' },
        roles: ['DomainAdmins', 'Resellers', 'SuperAdmins'],
      },
    ],
  },
  {
    icon: 'mdi-email-sync-outline',
    text: $gettext('IMAP Migration'),
    roles: ['SuperAdmins', 'Resellers'],
    children: [
      {
        text: $gettext('Email providers'),
        to: { name: 'ProvidersList' },
        roles: ['SuperAdmins', 'Resellers'],
      },
      {
        text: $gettext('Migrations'),
        to: { name: 'MigrationsList' },
        roles: ['Resellers', 'SuperAdmins'],
      },
    ],
  },
  {
    icon: 'mdi-cog',
    text: $gettext('Settings'),
    children: [],
    roles: ['SuperAdmins'],
  },
  {
    icon: 'mdi-information',
    text: $gettext('Information'),
    roles: ['SuperAdmins'],
    to: { name: 'Information' },
  },
]

const userSettingsMenuItems = [
  {
    text: $gettext('API'),
    roles: ['SuperAdmins'],
    to: { name: 'APISetup' },
    icon: 'mdi-api',
    exact: true,
  },
  {
    text: $gettext('Profile'),
    to: { name: 'UserProfile' },
    icon: 'mdi-account-circle-outline',
    exact: true,
  },
  {
    text: $gettext('Security'),
    to: { name: 'UserSecurity' },
    icon: 'mdi-lock-outline',
    exact: true,
  },
  // {
  //   text: $gettext('Preferences'),
  //   icon: 'mdi-tune',
  //   exact: true
  // },
  {
    text: $gettext('Forward'),
    condition: () => authUser.value.mailbox !== null,
    to: { name: 'UserForward' },
    icon: 'mdi-forward',
    exact: true,
  },
]

const userMenuItems = [
  {
    text: $gettext('Profile'),
    icon: 'mdi-account-circle-outline',
    to: { name: 'UserProfile' },
    click: () => null,
  },
  {
    text: $gettext('Logout'),
    icon: 'mdi-logout',
    click: logout,
  },
]

function displayMenuItem(item) {
  if (isAuthenticated.value) {
    const condition =
      (item.roles === undefined ||
        item.roles.indexOf(authUser.value.role) !== -1) &&
      (item.condition === undefined || item.condition()) &&
      item.activated !== false
    if (item.icon === 'mdi-email-sync-outline') {
      // For imapMigration
      return condition && imapMigration
    }
    return condition
  }
}
function logout() {
  authStore.$reset.then(() => {
    router.push({ name: 'Login' })
  })
}
</script>

<style lang="scss" scoped>
.v-list-item {
  &--active {
    &::before {
      opacity: 0;
    }
    background-color: #034bad;
    color: white;
    opacity: 1;
  }
}

.user-box {
  background: rgba(0, 0, 0, 0.25);
}

.logo {
  cursor: pointer;
}
</style>
