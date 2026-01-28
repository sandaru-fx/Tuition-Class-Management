<template>
  <q-card class="column full-height q-hoverable cursor-pointer custom-card">
    <q-img :src="course.thumbnail_url || 'https://cdn.quasar.dev/img/parallax2.jpg'" :ratio="16/9">
      <div class="absolute-bottom text-subtitle2 text-center bg-transparent-gradient">
        {{ course.title }}
      </div>
    </q-img>

    <q-card-section class="col">
      <div class="text-h6 ellipsis">{{ course.title }}</div>
      <div class="text-caption text-grey q-mt-xs ellipsis-2-lines">
        {{ course.description || 'No description available for this course.' }}
      </div>
      <div class="row items-center q-mt-sm">
        <q-icon name="person" size="xs" color="grey" class="q-mr-xs" />
        <span class="text-caption text-grey">{{ course.teacher?.name || 'Unknown Teacher' }}</span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="between">
      <div class="text-subtitle1 text-primary text-weight-bold">
        ${{ course.price }}
      </div>
      <q-btn flat color="primary" label="Enroll Now" icon="payment" @click.stop="$emit('enroll', course)" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
})

defineEmits(['enroll'])
</script>

<style scoped>
.custom-card {
  transition: all 0.3s ease;
}
.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.bg-transparent-gradient {
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}
</style>
