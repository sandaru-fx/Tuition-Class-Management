<template>
  <div class="sidebar-section q-mb-md">
    <q-expansion-item
      v-model="isExpanded"
      :icon="icon"
      :label="title"
      header-class="section-header"
      expand-icon-class="text-grey-6"
      default-opened
    >
      <template v-slot:header>
        <q-item-section avatar v-if="icon">
          <q-icon :name="icon" size="18px" color="grey-7" />
        </q-item-section>
        <q-item-section>
          <div class="text-overline text-grey-7 text-weight-bold" style="font-size: 11px; letter-spacing: 0.5px;">
            {{ title }}
          </div>
        </q-item-section>
      </template>

      <q-list padding class="q-pl-sm">
        <slot />
      </q-list>
    </q-expansion-item>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
})

const isExpanded = ref(true)
</script>

<style lang="scss" scoped>
.sidebar-section {
  :deep(.section-header) {
    padding: 8px 12px;
    min-height: 36px;
    border-radius: 6px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.02);
    }
  }
  
  :deep(.q-expansion-item__content) {
    padding-top: 4px;
  }
}
</style>
