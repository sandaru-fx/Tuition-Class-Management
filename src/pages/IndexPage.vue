<template>
  <q-page class="bg-white text-dark overflow-hidden font-outfit">
    
    <!-- Hero Section -->
    <div id="home" class="hero-section relative-position window-height flex flex-center overflow-hidden bg-white">
      <!-- Abstract Background Shapes -->
      <div class="absolute-full overflow-hidden">
        <div class="blob-1 absolute-top-right"></div>
        <div class="blob-2 absolute-bottom-left"></div>
        <div class="bg-grid absolute-full opacity-10"></div>
      </div>

      <div class="container q-mx-auto q-px-md relative-position z-top text-center" style="max-width: 1200px">
        <div class="fade-in-up">
          <div class="badge-premium q-mb-lg inline-block text-uppercase letter-spacing-2 text-weight-bold text-primary bg-blue-1 q-px-md q-py-sm rounded-borders">
            Establishment of Excellence
          </div>
          
          <h1 class="text-h1 text-weight-bolder q-mb-md text-dark line-height-tight" style="font-size: clamp(3rem, 6vw, 5.5rem);">
            SYZYGY<span class="text-primary">.</span>
          </h1>
          
          <p class="text-h4 text-weight-light text-grey-8 q-mb-xl" style="letter-spacing: 1px;">
            Aligning Potential with <span class="text-primary text-weight-bold">Greatness</span>
          </p>

          <div class="row justify-center q-gutter-md">
            <q-btn 
              unelevated
              rounded
              class="q-px-xl q-py-md text-weight-bold btn-primary-shadow text-white bg-primary"
              label="Student Portal" 
              size="lg" 
              no-caps
              to="/login"
              icon-right="arrow_forward"
            />
            <q-btn 
              outline
              rounded
              class="q-px-xl q-py-md text-weight-bold text-dark border-grey-4 bg-white"
              label="Explore Facilities" 
              size="lg" 
              no-caps
              @click="scrollTo('facilities')"
            />
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute-bottom text-center q-pb-lg animate-bounce cursor-pointer" @click="scrollTo('about')">
        <span class="text-caption text-uppercase letter-spacing-2 text-grey-6">Explore The Institute</span>
        <br>
        <q-icon name="keyboard_arrow_down" color="grey-6" size="32px" />
      </div>
    </div>

    <!-- About Section -->
    <div id="about" class="q-py-xl q-px-md bg-grey-1 relative-position">
      <div class="container q-mx-auto" style="max-width: 1200px">
        <div class="row q-col-gutter-xl items-center">
          <div class="col-12 col-md-6 scroll-reveal">
            <h2 class="text-h3 text-weight-bold q-mb-md text-dark">Beyond Traditional <br><span class="text-primary">Education</span></h2>
            <p class="text-h6 text-grey-7 text-weight-regular" style="line-height: 1.6">
              SYZYGY isn't just a tuition class; it's a center of academic alignment. We bring together the finest educators, state-of-the-art facilities, and a rigorous curriculum to ensure every student from Grade 1 to 12 finds their path to excellence.
            </p>
            <div class="row q-gutter-md q-mt-lg">
              <div class="col-auto">
                <div class="text-h3 text-weight-bold text-dark">12+</div>
                <div class="text-caption text-uppercase text-grey-6 text-weight-bold">Years of Excellence</div>
              </div>
              <div class="q-separator vertical bg-grey-4"></div>
              <div class="col-auto">
                <div class="text-h3 text-weight-bold text-dark">50+</div>
                <div class="text-caption text-uppercase text-grey-6 text-weight-bold">Expert Faculty</div>
              </div>
              <div class="q-separator vertical bg-grey-4"></div>
              <div class="col-auto">
                <div class="text-h3 text-weight-bold text-dark">100%</div>
                <div class="text-caption text-uppercase text-grey-6 text-weight-bold">University Selection</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 scroll-reveal delay-2">
            <div class="relative-position">
              <div class="abs-shape-square bg-blue-1"></div>
              <q-img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                class="rounded-xl shadow-xl border-white"
                style="height: 400px; border: 8px solid white;"
              >
              </q-img>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Academic Pathways (Classes) -->
    <div id="classes" class="q-py-xl q-px-md bg-white relative-position">
      <div class="container q-mx-auto" style="max-width: 1300px">
        <div class="text-center q-mb-xl scroll-reveal">
          <div class="text-overline text-primary letter-spacing-3 q-mb-xs text-weight-bold">ACADEMIC PATHWAYS</div>
          <h2 class="text-h3 text-weight-bold text-dark">From Foundation to Mastery</h2>
        </div>

        <div class="row q-col-gutter-lg">
          
          <!-- Primary -->
          <div class="col-12 col-md-3 scroll-reveal delay-1">
            <div class="class-card full-height column bg-white shadow-card rounded-xl overflow-hidden hover-lift border-green-bottom">
               <q-img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" :ratio="16/9" />
               <div class="q-pa-lg col column">
                 <div class="text-h5 text-weight-bold text-dark q-mb-xs">Primary</div>
                 <div class="text-subtitle2 text-primary text-weight-bold q-mb-md">Grades 1 - 5</div>
                 <p class="text-grey-7 text-caption col">Building strong foundations in Mathematics, Science, and Languages with activity-based learning.</p>
                 <q-list dense>
                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="24px"><q-icon name="check_circle" color="green" size="xs" /></q-item-section>
                    <q-item-section class="text-grey-8">Interactive Learning</q-item-section>
                  </q-item>
                </q-list>
               </div>
            </div>
          </div>

          <!-- Junior -->
          <div class="col-12 col-md-3 scroll-reveal delay-2">
             <div class="class-card full-height column bg-white shadow-card rounded-xl overflow-hidden hover-lift border-cyan-bottom">
               <q-img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" :ratio="16/9" />
               <div class="q-pa-lg col column">
                 <div class="text-h5 text-weight-bold text-dark q-mb-xs">Junior</div>
                 <div class="text-subtitle2 text-primary text-weight-bold q-mb-md">Grades 6 - 9</div>
                 <p class="text-grey-7 text-caption col">Transitioning to structured academic rigor. Focus on logical reasoning and subject depth.</p>
                 <q-list dense>
                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="24px"><q-icon name="check_circle" color="green" size="xs" /></q-item-section>
                    <q-item-section class="text-grey-8">Subject Specialization</q-item-section>
                  </q-item>
                </q-list>
               </div>
            </div>
          </div>

          <!-- O/L -->
          <div class="col-12 col-md-3 scroll-reveal delay-3">
             <div class="class-card full-height column bg-white shadow-card rounded-xl overflow-hidden hover-lift border-primary-bottom">
               <q-img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" :ratio="16/9" />
               <div class="q-pa-lg col column">
                 <div class="text-h5 text-weight-bold text-dark q-mb-xs">O/L Ordinary Level</div>
                 <div class="text-subtitle2 text-orange-9 text-weight-bold q-mb-md">Grades 10 - 11</div>
                 <p class="text-grey-7 text-caption col">Intensive preparation for Ordinary Level examinations with past paper revisions and seminars.</p>
                 <q-list dense>
                   <q-item class="q-px-none">
                    <q-item-section avatar min-width="24px"><q-icon name="star" color="orange" size="xs" /></q-item-section>
                    <q-item-section class="text-grey-8">Exam Focused</q-item-section>
                  </q-item>
                </q-list>
               </div>
            </div>
          </div>

           <!-- A/L -->
           <div class="col-12 col-md-3 scroll-reveal delay-4">
             <div class="class-card full-height column bg-white shadow-card rounded-xl overflow-hidden hover-lift border-gold-bottom">
               <q-img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" :ratio="16/9" />
               <div class="q-pa-lg col column">
                 <div class="text-h5 text-weight-bold text-dark q-mb-xs">A/L Advanced Level</div>
                 <div class="text-subtitle2 text-secondary text-weight-bold q-mb-md">Grade 12 - 13</div>
                 <p class="text-grey-7 text-caption col">Specialized streams (Science, Maths, Commerce, Arts) for university entrance.</p>
                 <q-list dense>
                   <q-item class="q-px-none">
                    <q-item-section avatar min-width="24px"><q-icon name="school" color="secondary" size="xs" /></q-item-section>
                    <q-item-section class="text-grey-8">University Entrance</q-item-section>
                  </q-item>
                </q-list>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>


    <!-- Facilities Showcase -->
    <div id="facilities" class="q-py-xl q-px-md bg-grey-1">
      <div class="container q-mx-auto" style="max-width: 1200px">
        <div class="row items-center q-mb-xl">
           <div class="col-12 col-md-8">
             <h2 class="text-h3 text-weight-bold text-dark">World Class <span class="text-primary">Facilities</span></h2>
             <p class="text-h6 text-grey-6">Creating the perfect environment for focus and learning.</p>
           </div>
           <div class="col-12 col-md-4 text-right gt-sm">
             <q-btn unelevated rounded color="white" text-color="primary" label="View Gallery" class="shadow-1" />
           </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8 scroll-reveal">
            <q-img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" class="rounded-xl shadow-lg full-height" />
          </div>
          <div class="col-12 col-md-4 column q-gutter-md scroll-reveal delay-1">
            <q-img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" class="col rounded-xl shadow-lg" />
            <q-img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" class="col rounded-xl shadow-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Contact & Location -->
    <div id="contact" class="q-py-xl q-px-md bg-white">
      <div class="container q-mx-auto" style="max-width: 1000px">
         <div class="bg-primary text-white q-pa-xl text-center rounded-xl shadow-2xl relative-position overflow-hidden">
           <!-- Decorative circles -->
           <div class="circle-1"></div>
           <div class="circle-2"></div>

           <div class="relative-position z-top">
             <h2 class="text-h3 text-weight-bold q-mb-lg font-outfit">Visit SYZYGY</h2>
             <p class="text-blue-1 q-mb-xl text-h6 text-weight-light">Join the elite educational community today.</p>

             <div class="row q-col-gutter-xl justify-center text-left">
               <div class="col-12 col-md-4">
                 <div class="row items-center q-mb-md">
                   <div class="bg-white/20 q-pa-sm rounded-borders q-mr-md">
                     <q-icon name="location_on" color="white" size="sm" />
                   </div>
                   <div>
                     <div class="text-weight-bold">Address</div>
                     <div class="text-blue-1 text-caption">123 Education Drive,<br>Colombo 07</div>
                   </div>
                 </div>
               </div>
               <div class="col-12 col-md-4">
                 <div class="row items-center q-mb-md">
                    <div class="bg-white/20 q-pa-sm rounded-borders q-mr-md">
                     <q-icon name="phone" color="white" size="sm" />
                   </div>
                   <div>
                     <div class="text-weight-bold">Admissions</div>
                     <div class="text-blue-1 text-caption">+94 11 234 5678<br>+94 77 123 4567</div>
                   </div>
                 </div>
               </div>
               <div class="col-12 col-md-4">
                 <div class="row items-center q-mb-md">
                    <div class="bg-white/20 q-pa-sm rounded-borders q-mr-md">
                     <q-icon name="email" color="white" size="sm" />
                   </div>
                   <div>
                     <div class="text-weight-bold">Email</div>
                     <div class="text-blue-1 text-caption">admissions@syzygy.lk<br>info@syzygy.lk</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>

         </div>
         
         <div class="q-mt-xl shadow-lg rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.251912613539!2d79.85175510427306!3d6.9218386564618215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593b0e14aa75%3A0x289735d4653697e8!2sColombo!5e0!3m2!1sen!2slk!4v1700683072898!5m2!1sen!2slk" 
              width="100%" 
              height="300" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy">
            </iframe>
         </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-grey-1 text-dark q-py-lg border-top-light">
      <div class="container q-mx-auto text-center">
        <div class="q-mb-sm text-weight-bold text-primary letter-spacing-2">SYZYGY INSTITUTE</div>
        <div class="text-caption text-grey-6">
          &copy; {{ new Date().getFullYear() }} All Rights Reserved. <span class="text-grey-8">Designed for Excellence.</span>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Scroll reveal logic
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* Font Imports */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Backgrounds & Text */
.text-dark { color: #0F172A !important; }
.bg-grey-1 { background-color: #F8FAFC !important; }
.border-top-light { border-top: 1px solid #E2E8F0; }

/* Hero Animations */
.hero-section {
  position: relative;
}

.blob-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  transform: translate(20%, -20%);
}
.blob-2 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(234,179,8,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  transform: translate(-20%, 20%);
}

.bg-grid {
  background-image: 
    linear-gradient(#e5e7eb 1px, transparent 1px),
    linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
  background-size: 40px 40px;
}

.opacity-10 { opacity: 0.4; }

/* Contact Decorative Circles */
.circle-1 {
  position: absolute;
  top: -50px; left: -50px;
  width: 200px; height: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}
.circle-2 {
  position: absolute;
  bottom: -50px; right: -50px;
  width: 300px; height: 300px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}

/* Shadows & Cards */
.shadow-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
}
.btn-primary-shadow {
  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3);
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.border-primary-bottom { border-bottom: 4px solid #2563EB; }
.border-gold-bottom { border-bottom: 4px solid #F59E0B; }
.border-green-bottom { border-bottom: 4px solid #22C55E; }
.border-cyan-bottom { border-bottom: 4px solid #06B6D4; }
.border-grey-4 { border-color: #CBD5E1; }

.abs-shape-square {
  position: absolute;
  top: -20px; right: -20px;
  width: 100%; height: 100%;
  border-radius: 20px;
  z-index: 0;
}

/* Utilities */
.letter-spacing-2 { letter-spacing: 2px; }
.line-height-tight { line-height: 1.1; }
.z-top { z-index: 10; }
.rounded-borders { border-radius: 6px; }

/* Animation Utilities */
.animate-bounce {
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-10px);}
  60% {transform: translateY(-5px);}
}

.fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}
.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
.delay-4 { transition-delay: 0.4s; }
</style>
