<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Role Management</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Define and manage user roles and their associated permissions.</p>
      </div>
      <q-space />
      <q-btn unelevated color="black" text-color="white" label="Create New Role" icon="add" no-caps />
    </div>

    <!-- Roles Grid -->
    <div class="row q-col-gutter-lg">
      <div v-for="role in roles" :key="role.name" class="col-12 col-md-4">
        <q-card class="my-card shadow-1 rounded-borders-lg q-pa-md h-100 column">
          <q-card-section class="row items-center">
            <q-avatar :color="role.color + '-1'" :text-color="role.color + '-9'" icon="security" size="48px" />
            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold font-outfit">{{ role.name }}</div>
              <div class="text-caption text-grey-6">{{ role.userCount }} assigned users</div>
            </div>
            <q-space />
            <q-btn flat round dense icon="more_vert" />
          </q-card-section>

          <q-card-section class="q-pt-none flex-grow">
            <div class="text-caption text-grey-7 text-uppercase text-weight-bold q-mb-sm letter-spacing-1">Permissions</div>
            <q-list dense>
              <q-item 
                v-for="permission in role.permissions" 
                :key="permission" 
                class="q-px-none min-height-0"
              >
                <q-item-section avatar class="min-width-0 q-pr-sm">
                  <q-icon name="check_circle" color="green-4" size="14px" />
                </q-item-section>
                <q-item-section class="text-grey-8 text-body2">
                  {{ permission }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator spaced />

          <q-card-actions class="justify-between">
            <q-btn flat color="primary" label="Edit Permissions" no-caps class="text-weight-bold" />
            <q-btn flat color="grey-7" label="View Users" no-caps />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Permission Matrix Info -->
    <q-card class="my-card shadow-1 rounded-borders-lg q-mt-xl bg-grey-1 border-dashed">
      <q-card-section class="row items-center">
        <q-icon name="info" color="blue-7" size="sm" class="q-mr-md" />
        <div class="text-grey-8">
          Roles define what actions users can perform across the system. Changes to roles affect all assigned users immediately.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const roles = ref([
  {
    name: 'Administrator',
    userCount: 2,
    color: 'purple',
    permissions: [
      'Full System Access',
      'Manage Users & Roles',
      'Financial Reports',
      'Site Settings'
    ]
  },
  {
    name: 'Teacher',
    userCount: 15,
    color: 'blue',
    permissions: [
      'Manage Assigned Classes',
      'Mark Attendance',
      'View Student Progress',
      'Message Parents'
    ]
  },
  {
    name: 'Office Staff',
    userCount: 5,
    color: 'orange',
    permissions: [
      'Register New Students',
      'Process Payments',
      'Issue Receipts',
      'Update Class Schedules'
    ]
  }
])
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.my-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}
.rounded-borders-lg {
  border-radius: 16px;
}
.letter-spacing-1 {
  letter-spacing: 1px;
}
.border-dashed {
  border: 1px dashed #d0d0d0 !important;
}
.flex-grow {
  flex-grow: 1;
}
.min-height-0 {
  min-height: 0;
}
.min-width-0 {
  min-width: 0;
}
</style>
