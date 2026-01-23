<template>
  <q-page class="bg-dark text-white overflow-hidden">
    
    <!-- Hero Section -->
    <div class="hero-section relative-position window-height flex flex-center">
      <q-parallax :height="height" :speed="0.5">
        <template v-slot:media>
          <img src="~assets/hero-abstract.png" style="opacity: 0.4; filter: contrast(1.2) brightness(0.8);">
        </template>

        <template v-slot:content="scope">
          <div class="absolute column items-center q-pa-md text-center" 
               :style="{
                 opacity: 1 - scope.percentScrolled,
                 transform: `translateY(${scope.percentScrolled * 50}px)`
               }">
             
            <h1 class="text-super-large text-uppercase q-mb-md fade-in-up" style="animation-delay: 0.2s">
              Educate.<br>Manage.<br>Excel.
            </h1>
            
            <p class="text-h5 text-grey-5 q-mb-xl fade-in-up" style="animation-delay: 0.4s; max-width: 600px;">
              The ultimate monochrome management system for modern tuition institutes.
            </p>

            <div class="fade-in-up" style="animation-delay: 0.6s">
              <q-btn 
                rounded 
                color="white" 
                text-color="black" 
                label="Get Started" 
                size="lg" 
                class="q-px-xl q-py-sm text-weight-bold"
                no-caps
              />
            </div>
          </div>
        </template>
      </q-parallax>
    </div>

    <!-- Features Section -->
    <div class="q-py-xl q-px-md bg-black relative-position z-top">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold text-gradient">Why Choose Us?</h2>
        <div class="text-grey-6">Premium tools for premium education.</div>
      </div>

      <div class="row q-col-gutter-xl container q-mx-auto" style="max-width: 1200px">
        
        <!-- Feature 1: Scheduling -->
        <div class="col-12 col-md-4">
          <div class="glass-card column items-center text-center q-pa-xl rounded-borders h-100">
             <div class="icon-container q-mb-lg">
               <q-img src="~assets/feature-schedule.png" width="100px" />
             </div>
             <h3 class="text-h5 text-weight-bold q-mb-sm">Smart Scheduling</h3>
             <p class="text-grey-5">Automate your timetables with AI-driven conflict resolution and easy updates.</p>
          </div>
        </div>

        <!-- Feature 2: Analytics -->
        <div class="col-12 col-md-4">
          <div class="glass-card column items-center text-center q-pa-xl rounded-borders h-100">
             <div class="icon-container q-mb-lg">
               <q-img src="~assets/feature-analytics.png" width="100px" />
             </div>
             <h3 class="text-h5 text-weight-bold q-mb-sm">Deep Analytics</h3>
             <p class="text-grey-5">Visualize student performance and financial growth with crystal clear monochrome charts.</p>
          </div>
        </div>

        <!-- Feature 3: Security -->
        <div class="col-12 col-md-4">
          <div class="glass-card column items-center text-center q-pa-xl rounded-borders h-100">
             <div class="icon-container q-mb-lg">
               <q-icon name="lock" size="80px" color="white" class="opacity-80" />
             </div>
             <h3 class="text-h5 text-weight-bold q-mb-sm">Total Security</h3>
             <p class="text-grey-5">Enterprise-grade encryption keeps your student data and payments safe.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Trust / Stats Section -->
    <div class="q-py-xl bg-dark text-center">
      <div class="row justify-center q-col-gutter-lg">
        <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder">1000+</div>
          <div class="text-uppercase text-caption letter-spacing-2">Students Managed</div>
        </div>
         <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder">100%</div>
          <div class="text-uppercase text-caption letter-spacing-2">Uptime</div>
        </div>
      </div>
    </div>

    <!-- Footer / CTA -->
    <div class="q-py-xl bg-black text-center border-top-white-10">
      <h2 class="text-h4 text-weight-bold q-mb-lg">Ready to transform your institute?</h2>
      
      <div class="row justify-center q-gutter-md q-mb-xl">
        <q-input 
          dark 
          outlined 
          placeholder="Enter your email" 
          class="col-10 col-sm-4"
          bg-color="transparent"
        />
        <q-btn outline color="white" label="Join Waitlist" size="lg" no-caps />
      </div>

      <div class="text-grey-7 text-caption">
        &copy; 2026 Tuition Management System. All rights reserved.
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const height = ref(800)

onMounted(() => {
  height.value = $q.screen.height
})

</script>

<style scoped>
.hero-section {
  position: relative;
}
.letter-spacing-2 {
  letter-spacing: 2px;
}
.border-top-white-10 {
  border-top: 1px solid rgba(255,255,255,0.1);
}
.h-100 {
  height: 100%;
}
.z-top {
  z-index: 10;
}
.opacity-80 {
  opacity: 0.8;
}
</style>
