<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-gray-soft transition-all">
    
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
        <div class="col-12 col-md-auto">
            <h1 class="text-h3 text-weight-black font-outfit text-slate-900 q-my-none tracking-tighter">
                Settings
            </h1>
            <p class="text-subtitle1 text-slate-500 q-mt-sm q-mb-none font-medium">
                Manage your account preferences and login security.
            </p>
        </div>
    </div>

    <div class="row q-col-gutter-xl">
        <!-- Sidebar Navigation for Settings -->
        <div class="col-12 col-md-4 col-lg-3">
             <q-card flat class="bg-white rounded-3xl q-pa-md border-slate shadow-soft">
                  <q-list class="q-gutter-y-sm">
                      <q-item clickable v-ripple v-for="s in settingsNav" :key="s.name" :active="tab === s.name" @click="tab = s.name" class="nav-item-settings" active-class="nav-item-settings--active">
                          <q-item-section avatar>
                              <q-icon :name="s.icon" size="20px" />
                          </q-item-section>
                          <q-item-section class="text-weight-bold">{{ s.label }}</q-item-section>
                      </q-item>
                  </q-list>
             </q-card>
        </div>

        <!-- Settings Panels -->
        <div class="col-12 col-md-8 col-lg-9">
             <q-tab-panels v-model="tab" animated class="bg-transparent">
                 <q-tab-panel name="profile" class="q-pa-none">
                      <q-card flat class="bg-white q-pa-xl rounded-3xl border-slate shadow-soft">
                           <div class="row items-center q-mb-xl">
                               <q-avatar size="84px" class="q-mr-xl shadow-md border-2 border-white">
                                    <img src="https://ui-avatars.com/api/?name=Sandaru+Chamod&background=3b82f6&color=fff">
                               </q-avatar>
                               <div class="col">
                                   <div class="text-h6 text-weight-black text-slate-900 font-outfit">Profile Picture</div>
                                   <div class="text-caption text-slate-500 font-medium q-mb-md">PNG, JPG or GIF. Max 5MB.</div>
                                   <div class="row q-gutter-sm">
                                       <q-btn unelevated color="blue-6" label="Upload New" no-caps class="rounded-xl q-px-md text-weight-bold" />
                                       <q-btn flat color="red" label="Remove" no-caps class="rounded-xl q-px-md text-weight-bold" />
                                   </div>
                               </div>
                           </div>

                           <div class="row q-col-gutter-lg">
                               <div class="col-12 col-sm-6">
                                   <q-input v-model="profile.name" label="Full Name" stack-label borderless class="bg-slate-50 rounded-xl q-px-lg" />
                               </div>
                               <div class="col-12 col-sm-6">
                                   <q-input v-model="profile.email" label="Email Address" stack-label borderless class="bg-slate-50 rounded-xl q-px-lg" disable />
                               </div>
                               <div class="col-12">
                                   <q-input v-model="profile.bio" label="Bio" type="textarea" stack-label borderless class="bg-slate-50 rounded-xl q-px-lg" />
                               </div>
                           </div>
                           
                           <div class="row justify-end q-mt-xl">
                               <q-btn unelevated color="blue-6" label="Save Changes" no-caps class="rounded-xl q-px-xl q-py-md text-weight-black shadow-md hover-scale" />
                           </div>
                      </q-card>
                 </q-tab-panel>

                 <q-tab-panel name="notifications" class="q-pa-none">
                      <q-card flat class="bg-white q-pa-xl rounded-3xl border-slate shadow-soft">
                           <div class="text-h6 text-weight-black font-outfit q-mb-xl">Email Notifications</div>
                           <q-list class="q-gutter-y-lg">
                               <q-item class="q-pa-none">
                                   <q-item-section>
                                       <q-item-label class="text-weight-black text-slate-900">Course Updates</q-item-label>
                                       <q-item-label caption class="text-slate-500">Receive emails when new lessons are added.</q-item-label>
                                   </q-item-section>
                                   <q-item-section side>
                                       <q-toggle v-model="notif.courses" color="blue-6" />
                                   </q-item-section>
                               </q-item>
                               <q-separator class="opacity-10" />
                               <q-item class="q-pa-none">
                                   <q-item-section>
                                       <q-item-label class="text-weight-black text-slate-900">Assignment Deadlines</q-item-label>
                                       <q-item-label caption class="text-slate-500">Get reminded 24 hours before a deadline.</q-item-label>
                                   </q-item-section>
                                   <q-item-section side>
                                       <q-toggle v-model="notif.deadlines" color="blue-6" />
                                   </q-item-section>
                               </q-item>
                           </q-list>
                      </q-card>
                 </q-tab-panel>
             </q-tab-panels>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('profile')

const settingsNav = ref([
    { name: 'profile', label: 'My Profile', icon: 'person' },
    { name: 'notifications', label: 'Notifications', icon: 'notifications' },
    { name: 'security', label: 'Security', icon: 'security' },
    { name: 'billing', label: 'Subscription', icon: 'credit_card' },
])

const profile = ref({
    name: 'Sandaru Chamod',
    email: 'sandaruchamod62@gmail.com',
    bio: 'Student at University of Moratuwa. Passionate about Mathematics and Physics.'
})

const notif = ref({
    courses: true,
    deadlines: true
})
</script>

<style lang="scss" scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.tracking-tighter { letter-spacing: -2px; }
.bg-gray-soft { background-color: #F8FAFC; }

.border-slate { border: 1px solid #E2E8F0; }
.shadow-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); }

.nav-item-settings {
    border-radius: 12px;
    color: #64748B;
    transition: all 0.3s ease;
    
    &--active {
        background: #EFF6FF !important;
        color: #2563EB !important;
    }
}

.text-slate-900 { color: #0F172A; }
.text-slate-500 { color: #64748B; }

// Dark Mode
.body--dark {
    .bg-gray-soft { background-color: #0f172a !important; }
    .bg-white { background-color: #1e293b !important; }
    .border-slate { border-color: #334155 !important; }
    .bg-slate-50 { background-color: #334155 !important; }
    .text-slate-900 { color: #f1f5f9 !important; }
    .text-slate-500 { color: #94a3b8 !important; }
}
</style>
