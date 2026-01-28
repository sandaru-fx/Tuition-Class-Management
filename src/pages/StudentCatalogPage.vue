<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md items-center justify-between">
      <h1 class="text-h4 q-my-none">Course Catalog</h1>
      <q-input dense outlined v-model="search" placeholder="Search courses..." class="q-ml-md" style="width: 300px">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="courses.length === 0" class="text-center text-grey q-pa-xl">
      <q-icon name="school" size="4rem" />
      <div class="text-h6 q-mt-md">No courses found</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="course in filteredCourses" :key="course.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <CourseCard :course="course" @enroll="enrollInCourse" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import CourseCard from 'components/CourseCard.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const courses = ref([])
const loading = ref(true)
const search = ref('')

// Fetch all courses with teacher details
async function fetchCourses() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, teacher:profiles(name)')
    
    if (error) throw error
    courses.value = data
  } catch (error) {
    console.error('Error fetching courses:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load courses'
    })
  } finally {
    loading.value = false
  }
}

const filteredCourses = computed(() => {
  if (!search.value) return courses.value
  const term = search.value.toLowerCase()
  return courses.value.filter(c => 
    c.title.toLowerCase().includes(term) || 
    c.description?.toLowerCase().includes(term)
  )
})

function enrollInCourse(course) {
  // For now, simple alert or logic. Later -> Payment Gateway
  $q.dialog({
    title: 'Confirm Enrollment',
    message: `Do you want to enroll in ${course.title} for $${course.price}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await processEnrollment(course)
  })
}

async function processEnrollment(course) {
    try {
        const user = (await supabase.auth.getUser()).data.user
        if (!user) return

        // Create enrollment record
        const { error } = await supabase
            .from('enrollments')
            .insert({
                student_id: user.id,
                course_id: course.id,
                status: 'pending', // Pending until payment (mock)
                transaction_ref: 'PAY-' + Date.now()
            })

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                 $q.notify({ type: 'warning', message: 'You are already enrolled/pending for this course.' })
            } else {
                throw error
            }
        } else {
            $q.notify({ type: 'positive', message: 'Enrollment request sent! Proceed to payment.' })
        }

    } catch (err) {
        console.error(err)
        $q.notify({ type: 'negative', message: 'Enrollment failed.' })
    }
}

onMounted(() => {
  fetchCourses()
})
</script>
