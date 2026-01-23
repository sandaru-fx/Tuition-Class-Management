<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">User Management</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage system users, their access, and account status.</p>
      </div>
      <q-space />
      <q-btn unelevated color="black" text-color="white" label="Add New User" icon="add" no-caps @click="openAddDialog" />
    </div>

    <!-- Users Table -->
    <q-card class="my-card shadow-1 rounded-borders-lg overflow-hidden">
      <q-card-section class="q-pa-md bg-grey-1 row items-center">
        <q-input dense outlined bg-color="white" v-model="search" placeholder="Search users..." class="col-12 col-sm-4">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn flat round color="grey-7" icon="filter_list" />
      </q-card-section>

      <q-markup-table flat class="text-left">
        <thead>
          <tr class="bg-grey-1">
            <th class="text-left text-grey-7 text-weight-bold q-pl-lg">User</th>
            <th class="text-left text-grey-7 text-weight-bold">Role</th>
            <th class="text-left text-grey-7 text-weight-bold">Status</th>
            <th class="text-left text-grey-7 text-weight-bold">Last Active</th>
            <th class="text-right text-grey-7 text-weight-bold q-pr-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="text-center q-pa-xl text-grey-6">
              <q-icon name="group_off" size="48px" class="q-mb-md" />
              <div>No users found matching your search.</div>
            </td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover-bg-grey-1 transition-all">
            <td class="q-pl-lg">
              <div class="row items-center">
                <q-avatar size="36px" color="blue-1" text-color="blue-8" class="q-mr-md text-weight-bold">
                  {{ user.name.charAt(0) }}
                </q-avatar>
                <div class="column">
                  <span class="text-weight-bold text-dark">{{ user.name }}</span>
                  <span class="text-caption text-grey-6">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td>
              <q-chip size="sm" :color="getRoleColor(user.role)" :text-color="getRoleTextColor(user.role)" class="text-weight-bold">
                {{ user.role }}
              </q-chip>
            </td>
            <td>
              <q-badge rounded :color="user.status === 'Active' ? 'green' : 'grey'" class="q-px-sm" />
              <span class="q-ml-sm text-grey-8">{{ user.status }}</span>
            </td>
            <td class="text-grey-7">{{ user.lastActive }}</td>
            <td class="text-right q-pr-lg">
              <q-btn flat round dense color="grey-7" icon="edit" class="q-mr-xs" @click="openEditDialog(user)" />
              <q-btn flat round dense color="red-4" icon="delete" @click="confirmDelete(user)" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      
      <q-card-section class="row items-center justify-between bg-grey-1 text-grey-7 text-caption">
        <span>Showing {{ filteredUsers.length }} of {{ users.length }} entries</span>
        <div class="row q-gutter-xs">
          <q-btn flat dense color="grey-7" icon="chevron_left" :disable="true" />
          <q-btn flat dense color="primary" label="1" />
          <q-btn flat dense color="grey-7" icon="chevron_right" :disable="true" />
        </div>
      </q-card-section>
    </q-card>

    <!-- User Dialog (Add / Edit) -->
    <q-dialog v-model="showUserDialog">
      <q-card style="min-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;" class="q-pa-md rounded-borders-lg">
        <q-card-section>
          <div class="text-h6 font-outfit">{{ isEditing ? 'Edit User' : 'Add New User' }}</div>
          <div class="text-body2 text-grey-8">Enter the user's details below.</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input outlined v-model="userForm.name" label="Full Name" dense class="light-border" />
          <q-input outlined v-model="userForm.email" label="Email" dense type="email" class="light-border" />
          <q-select outlined v-model="userForm.role" :options="['Admin', 'Teacher', 'Staff']" label="Role" dense class="light-border" popup-content-class="text-black" />
          <q-select outlined v-model="userForm.status" :options="['Active', 'Inactive']" label="Status" dense class="light-border" popup-content-class="text-black" />
        </q-card-section>

        <q-card-actions align="right" class="q-pt-lg">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup no-caps />
          <q-btn unelevated :label="isEditing ? 'Update User' : 'Create User'" color="black" @click="saveUser" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px" class="q-pa-sm rounded-borders-lg">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" size="md" />
          <span class="q-ml-md text-h6 font-outfit">Confirm Delete</span>
        </q-card-section>

        <q-card-section class="q-pt-none text-grey-8">
          Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>? This action cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Delete User" color="red" @click="deleteUser" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const search = ref('')
const showUserDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const userToDelete = ref(null)

const userForm = ref({
  id: null,
  name: '',
  email: '',
  role: 'Staff',
  status: 'Active'
})

const users = ref([
  { id: 1, name: 'Admin User', email: 'admin@classmaster.com', role: 'Admin', status: 'Active', lastActive: 'Now' },
  { id: 2, name: 'Sahan Perera', email: 'sahan@teacher.com', role: 'Teacher', status: 'Active', lastActive: '2 hours ago' },
  { id: 3, name: 'Kavindi Silva', email: 'kavindi@teacher.com', role: 'Teacher', status: 'Inactive', lastActive: '2 days ago' },
  { id: 4, name: 'Nuwan Pradeep', email: 'nuwan@staff.com', role: 'Staff', status: 'Active', lastActive: '5 hours ago' }
])

// Filtering logic
const filteredUsers = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return users.value
  return users.value.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query) || 
    u.role.toLowerCase().includes(query)
  )
})

function getRoleColor(role) {
  switch (role) {
    case 'Admin': return 'purple-1'
    case 'Teacher': return 'blue-1'
    default: return 'grey-2'
  }
}

function getRoleTextColor(role) {
  switch (role) {
    case 'Admin': return 'purple-9'
    case 'Teacher': return 'blue-9'
    default: return 'grey-9'
  }
}

function openAddDialog() {
  isEditing.value = false
  userForm.value = { id: null, name: '', email: '', role: 'Staff', status: 'Active' }
  showUserDialog.value = true
}

function openEditDialog(user) {
  isEditing.value = true
  userForm.value = { ...user }
  showUserDialog.value = true
}

function saveUser() {
  if (!userForm.value.name || !userForm.value.email) {
    $q.notify({ type: 'warning', message: 'Please fill in all required fields' })
    return
  }

  if (isEditing.value) {
    const index = users.value.findIndex(u => u.id === userForm.value.id)
    if (index !== -1) {
      users.value[index] = { ...userForm.value }
      $q.notify({ type: 'positive', message: 'User updated successfully' })
    }
  } else {
    const newId = users.value.length ? Math.max(...users.value.map(u => u.id)) + 1 : 1
    users.value.push({
      ...userForm.value,
      id: newId,
      lastActive: 'Just now'
    })
    $q.notify({ type: 'positive', message: 'User added successfully' })
  }
  showUserDialog.value = false
}

function confirmDelete(user) {
  userToDelete.value = user
  showDeleteDialog.value = true
}

function deleteUser() {
  users.value = users.value.filter(u => u.id !== userToDelete.value.id)
  $q.notify({ type: 'positive', message: 'User deleted successfully' })
  showDeleteDialog.value = false
}
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
.hover-bg-grey-1:hover {
  background-color: #fafafa;
}
.transition-all {
  transition: all 0.3s ease;
}
.flex-grow {
  flex-grow: 1;
}
.light-border :deep(.q-field__control:before) {
  border-color: #e0e0e0 !important; 
}
.light-border :deep(.q-field__control:hover:before) {
  border-color: #bdbdbd !important;
}
</style>
