<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-xl">
      <div class="col-12">
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">My Profile</h1>
        <p class="text-grey-7 text-subtitle1">Manage your account settings and preferences.</p>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Profile Card -->
      <div class="col-12 col-md-4">
        <q-card class="my-card shadow-1 text-center q-pa-lg">
          <q-card-section>
            <q-avatar size="120px" class="shadow-3 q-mb-md">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-h5 text-weight-bold font-outfit q-mb-xs">Admin User</div>
            <div class="text-subtitle2 text-grey-6">Administrator</div>
          </q-card-section>

          <q-card-section>
            <q-chip outline color="primary" icon="verified" label="Verified Account" />
          </q-card-section>

          <q-separator spaced />

          <q-card-section class="text-left">
            <div class="row items-center q-mb-md">
              <q-icon name="email" color="grey-6" class="q-mr-sm" size="20px" />
              <div class="text-grey-8">admin@classmaster.com</div>
            </div>
            <div class="row items-center q-mb-md">
              <q-icon name="phone" color="grey-6" class="q-mr-sm" size="20px" />
              <div class="text-grey-8">+94 77 123 4567</div>
            </div>
            <div class="row items-center">
              <q-icon name="location_on" color="grey-6" class="q-mr-sm" size="20px" />
              <div class="text-grey-8">Colombo, Sri Lanka</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Edit Settings Form -->
      <div class="col-12 col-md-8">
        <q-card class="my-card shadow-1 q-pa-lg">
          <q-card-section>
            <div class="text-h6 text-weight-bold font-outfit q-mb-md">Personal Information</div>
            
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="firstName"
                    outlined
                    dense
                    label="First Name"
                    color="primary"
                    bg-color="grey-1"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="lastName"
                    outlined
                    dense
                    label="Last Name"
                    color="primary"
                    bg-color="grey-1"
                  />
                </div>
              </div>

              <q-input
                v-model="email"
                outlined
                dense
                label="Email Address"
                type="email"
                readonly
                hint="Contact support to change email"
                color="primary"
                bg-color="grey-1"
              />

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                   <q-input
                    v-model="phone"
                    outlined
                    dense
                    label="Phone Number"
                    color="primary"
                     bg-color="grey-1"
                  />
                </div>
                <div class="col-12 col-sm-6">
                   <q-input
                    v-model="role"
                    outlined
                    dense
                    label="Role"
                    readonly
                    bg-color="grey-1"
                    color="primary"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn unelevated color="grey-3" text-color="black" label="Cancel" class="q-mr-sm" no-caps />
                <q-btn unelevated color="black" text-color="white" label="Save Changes" type="submit" no-caps />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Security / Password -->
        <q-card class="my-card shadow-1 q-pa-lg q-mt-lg">
           <q-card-section>
             <div class="row items-center justify-between">
               <div>
                 <div class="text-h6 text-weight-bold font-outfit">Security</div>
                 <div class="text-grey-6 text-body2">Manage your password and security settings.</div>
               </div>
               <q-btn outline color="primary" label="Change Password" no-caps />
             </div>
           </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const firstName = ref('Admin')
const lastName = ref('User')
const email = ref('admin@classmaster.com')
const phone = ref('+94 77 123 4567')
const role = ref('Administrator')

function onSubmit() {
  // Simulate API update
  setTimeout(() => {
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully',
      position: 'top'
    })
  }, 1000)
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
</style>
