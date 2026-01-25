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
        <q-btn flat round color="grey-7" icon="refresh" @click="fetchUsers" :loading="loading" />
      </q-card-section>

      <q-markup-table flat class="text-left">
        <thead>
          <tr class="bg-grey-1">
            <th class="text-left text-grey-7 text-weight-bold q-pl-lg">User</th>
            <th class="text-left text-grey-7 text-weight-bold">Role</th>
            <th class="text-left text-grey-7 text-weight-bold">Status</th>
            <th class="text-left text-grey-7 text-weight-bold">Created At</th>
            <th class="text-right text-grey-7 text-weight-bold q-pr-lg">Actions</th>
          </tr>
        </thead>
        <tbody v-if="loading">
            <tr>
                <td colspan="5" class="text-center q-pa-lg">
                    <q-spinner color="primary" size="2em" />
                    <div class="q-mt-sm">Loading users...</div>
                </td>
            </tr>
        </tbody>
        <tbody v-else>
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
                  {{ (user.name || user.email || 'U').charAt(0).toUpperCase() }}
                </q-avatar>
                <div class="column">
                  <span class="text-weight-bold text-dark">{{ user.name || 'Unnamed User' }}</span>
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
              <q-badge rounded :color="getParams(user).color" class="q-px-sm" />
              <span class="q-ml-sm text-grey-8">{{ getParams(user).status }}</span>
            </td>
            <td class="text-grey-7">{{ new Date(user.created_at).toLocaleDateString() }}</td>
            <td class="text-right q-pr-lg">
              <q-btn flat round dense color="grey-7" icon="edit" class="q-mr-xs" @click="openEditDialog(user)" />
              <q-btn flat round dense color="red-4" icon="delete" @click="confirmDelete(user)" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>

    <!-- User Dialog (Add / Edit) -->
    <q-dialog v-model="showUserDialog">
      <q-card style="min-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;" class="q-pa-md rounded-borders-lg">
        <q-card-section>
          <div class="text-h6 font-outfit">{{ isEditing ? 'Edit User' : 'Add New User' }}</div>
          <div class="text-body2 text-grey-8">Enter the user's details below.</div>
          <div v-if="!isEditing" class="q-mt-sm bg-blue-1 text-blue-9 q-pa-sm rounded-borders text-caption">
            <q-icon name="info" /> The user will use this Email and Password to log in.
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input outlined v-model="userForm.name" label="Full Name" dense class="light-border" :rules="[val => !!val || 'Required']" />
          <q-input outlined v-model="userForm.email" label="Email" dense type="email" class="light-border" :rules="[val => !!val || 'Required']" :disable="isEditing" />
          
          <!-- Password only for new users -->
          <q-input 
            v-if="!isEditing"
            outlined 
            v-model="userForm.password" 
            label="Password" 
            dense 
            type="password" 
            class="light-border" 
            :rules="[val => !!val || 'Required', val => val.length >= 6 || 'Min 6 chars']"
          />

          <q-select outlined v-model="userForm.role" :options="['student', 'teacher', 'admin', 'staff']" label="Role" dense class="light-border" popup-content-class="text-black" />
        </q-card-section>

        <q-card-actions align="right" class="q-pt-lg">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup no-caps />
          <q-btn unelevated :label="isEditing ? 'Update User' : 'Create User'" color="black" @click="saveUser" no-caps :loading="submitting" />
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
          Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>? This will remove them from the database but might not remove their Auth login immediately.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Delete User" color="red" @click="deleteUser" no-caps :loading="submitting" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { createClient } from '@supabase/supabase-js'

const $q = useQuasar()
const search = ref('')
const showUserDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const userToDelete = ref(null)
const loading = ref(false)
const submitting = ref(false)

const userForm = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: 'student',
  status: 'Active'
})

const users = ref([])

onMounted(() => {
    fetchUsers()
})

async function fetchUsers() {
    loading.value = true
    try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
        if (error) throw error
        users.value = data || []
    } catch (err) {
        console.error(err)
        $q.notify({ type: 'negative', message: 'Failed to fetch users' })
    } finally {
        loading.value = false
    }
}

// Filtering logic
const filteredUsers = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return users.value
  return users.value.filter(u => 
    (u.name || '').toLowerCase().includes(query) || 
    (u.email || '').toLowerCase().includes(query) || 
    (u.role || '').toLowerCase().includes(query)
  )
})

function getRoleColor(role) {
  switch (role) {
    case 'admin': return 'purple-1'
    case 'teacher': return 'blue-1'
    case 'student': return 'green-1'
    default: return 'grey-2'
  }
}

function getRoleTextColor(role) {
  switch (role) {
    case 'admin': return 'purple-9'
    case 'teacher': return 'blue-9'
    case 'student': return 'green-9'
    default: return 'grey-9'
  }
}

// Mock status getter as simple active check
function getParams() {
    // Status is always active for now
    return { status: 'Active', color: 'green' }
}

function openAddDialog() {
  isEditing.value = false
  userForm.value = { id: null, name: '', email: '', password: '', role: 'teacher', status: 'Active' }
  showUserDialog.value = true
}

function openEditDialog(user) {
  isEditing.value = true
  userForm.value = { ...user, password: '' } // Password blank for edit
  showUserDialog.value = true
}

async function saveUser() {
  if (!userForm.value.name || !userForm.value.email) {
    $q.notify({ type: 'warning', message: 'Please fill in all required fields' })
    return
  }

  submitting.value = true

  try {
      if (isEditing.value) {
        // Update Profile Only
        const { error } = await supabase
            .from('profiles')
            .update({ name: userForm.value.name, role: userForm.value.role })
            .eq('id', userForm.value.id)
        
        if (error) throw error
        $q.notify({ type: 'positive', message: 'User updated successfully' })
      } else {
        // Create New User
        if (!userForm.value.password || userForm.value.password.length < 6) {
             $q.notify({ type: 'warning', message: 'Password is required (min 6 chars)' })
             return
        }

        // 1. Create Login (using temp client to avoid session hijack)
        const tempClient = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        })

        const { data: authData, error: authError } = await tempClient.auth.signUp({
            email: userForm.value.email,
            password: userForm.value.password,
            options: {
                data: { role: userForm.value.role } // Store role in metadata too if needed
            }
        })

        if (authError) throw authError

        const userId = authData.user?.id
        
        if (!userId) {
            throw new Error('User creation failed (no ID returned)')
        }

        // 2. Create Profile (if not created by trigger)
        // Check if exists first (sometimes triggers do it)
        const { data: existing } = await supabase.from('profiles').select('id').eq('id', userId).single()
        
        if (!existing) {
             const { error: profileError } = await supabase.from('profiles').insert({
                id: userId,
                name: userForm.value.name,
                email: userForm.value.email,
                role: userForm.value.role
            })
            if (profileError) throw profileError
        } else {
            // Update the automatically created profile with name/role
            const { error: updateError } = await supabase.from('profiles').update({
                name: userForm.value.name,
                role: userForm.value.role
            }).eq('id', userId)
            if (updateError) throw updateError
        }

        $q.notify({ type: 'positive', message: 'User created successfully! You can give the credentials to the teacher.' })
      }
      
      showUserDialog.value = false
      fetchUsers() // Refresh list

  } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Error: ' + (err.message || 'Operation failed') })
  } finally {
      submitting.value = false
  }
}

async function confirmDelete(user) {
  userToDelete.value = user
  showDeleteDialog.value = true
}

async function deleteUser() {
  submitting.value = true
  try {
    // Note: This only deletes the profile. Deleting the Auth user currently requires Edge Functions or Admin API.
    const { error } = await supabase.from('profiles').delete().eq('id', userToDelete.value.id)
    if (error) throw error

    $q.notify({ type: 'positive', message: 'User profile deleted. (Auth account may still remain)' })
    showDeleteDialog.value = false
    fetchUsers()
  } catch (err) {
      $q.notify({ type: 'negative', message: err.message })
  } finally {
      submitting.value = false
  }
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
.light-border :deep(.q-field__control:before) {
  border-color: #e0e0e0 !important; 
}
.light-border :deep(.q-field__control:hover:before) {
  border-color: #bdbdbd !important;
}
</style>
