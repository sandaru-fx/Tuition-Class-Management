<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-indigo-9 text-white">
      <q-toolbar>
        <q-toolbar-title class="font-outfit text-weight-bold">
          <q-icon name="family_restroom" size="md" class="q-mr-sm" />
          Parent Portal
        </q-toolbar-title>
        <q-btn flat round dense icon="logout" label="Exit" @click="$router.push('/')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    
    <q-footer class="bg-grey-2 text-grey-7 text-center q-py-sm text-caption">
        &copy; {{ new Date().getFullYear() }} Tuition Class Management
    </q-footer>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
</style>
