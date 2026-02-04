<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="bg-white text-dark overflow-hidden font-outfit">
        
        <!-- Floating Navigation Bar -->
        <div class="nav-container">
          <nav class="floating-nav" :class="{ 'scrolled': isScrolled }">
            <div class="nav-inner">
              <!-- Logo -->
              <div class="nav-logo cursor-pointer" @click="scrollTo('home')">
                <span class="text-weight-bolder text-h6 text-dark">SYZYGY<span class="text-primary">.</span></span>
              </div>
              
              <!-- Desktop Navigation Links -->
              <div class="nav-links gt-sm">
                <a 
                  v-for="link in navLinks" 
                  :key="link.id"
                  @click="scrollTo(link.id)"
                  class="nav-link"
                  :class="{ 'active': activeSection === link.id }"
                >
                  {{ link.label }}
                  <div class="nav-link-indicator"></div>
                </a>
                
                <!-- Classes with Mega Menu -->
                <div class="nav-link-wrapper" @mouseenter="showMegaMenu = true" @mouseleave="showMegaMenu = false">
                  <a class="nav-link" :class="{ 'active': activeSection === 'classes' }">
                    Classes
                    <q-icon name="expand_more" size="18px" class="q-ml-xs" />
                    <div class="nav-link-indicator"></div>
                  </a>
                  
                  <!-- Mega Menu -->
                  <transition name="fade-slide">
                    <div v-show="showMegaMenu" class="mega-menu">
                      <div class="mega-menu-grid">
                        <div 
                          v-for="classLevel in classLevels" 
                          :key="classLevel.id"
                          class="mega-menu-item"
                          @click="scrollTo('classes'); showMegaMenu = false"
                        >
                          <q-icon :name="classLevel.icon" :color="classLevel.color" size="32px" class="q-mb-sm" />
                          <div class="text-weight-bold text-dark">{{ classLevel.title }}</div>
                          <div class="text-caption text-grey-7">{{ classLevel.grades }}</div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              
              <!-- Auth Buttons (Desktop) -->
              <div class="nav-auth gt-sm">
                <q-btn flat rounded no-caps label="Login" to="/login" class="text-dark" />
                <q-btn unelevated rounded no-caps label="Sign Up" to="/register" color="dark" class="text-white" />
              </div>
              
              <!-- Mobile Menu Button -->
              <q-btn flat round dense icon="menu" class="lt-md" @click="mobileMenuOpen = true" />
            </div>
          </nav>
        </div>

        <!-- Hero Section -->
        <div id="home" class="hero-section relative-position window-height flex flex-center overflow-hidden bg-white">
          <!-- Abstract Background Shapes -->
          <div class="absolute-full overflow-hidden">
            <div class="blob-1 absolute-top-right"></div>
            <div class="blob-2 absolute-bottom-left"></div>
            <div class="glow-center absolute-center"></div>
            <div class="bg-grid absolute-full opacity-10"></div>
          </div>

          <div class="container q-mx-auto q-px-md relative-position z-top text-center" style="max-width: 1200px">
            <div class="fade-in-up">
              <div class="badge-premium q-mb-lg inline-block text-uppercase letter-spacing-2 text-weight-bold text-primary bg-blue-1 q-px-md q-py-sm rounded-borders">
                Establishment of Excellence
              </div>
              
              <h1 class="text-h1 text-weight-bolder q-mb-md text-dark line-height-tight" style="font-size: clamp(3rem, 6vw, 5.5rem); letter-spacing: -0.02em;">
                SYZYGY<span class="text-primary">.</span>
              </h1>
              
              <p class="text-h4 text-weight-light text-grey-8 q-mb-xl" style="letter-spacing: 1px;">
                Aligning Potential with <span class="text-weight-bold" style="color: #f59e0b;">Greatness</span>
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
    </q-page-container>

    <!-- Mobile Menu Drawer (Now a child of q-layout) -->
    <q-drawer v-model="mobileMenuOpen" side="right" overlay behavior="mobile" class="mobile-menu">
      <div class="q-pa-lg">
        <div class="row justify-between items-center q-mb-xl">
          <span class="text-h6 text-weight-bold">Menu</span>
          <q-btn flat round dense icon="close" @click="mobileMenuOpen = false" />
        </div>
        
        <div class="column q-gutter-md">
          <a 
            v-for="link in navLinks" 
            :key="link.id"
            @click="scrollTo(link.id); mobileMenuOpen = false"
            class="mobile-nav-link text-h6"
          >
            {{ link.label }}
          </a>
          
          <!-- Classes Accordion -->
          <q-expansion-item label="Classes" class="mobile-nav-link text-h6">
            <div class="q-pa-md q-gutter-sm">
              <div 
                v-for="classLevel in classLevels" 
                :key="classLevel.id"
                @click="scrollTo('classes'); mobileMenuOpen = false"
                class="mobile-class-item q-pa-sm"
              >
                <div class="text-weight-medium">{{ classLevel.title }}</div>
                <div class="text-caption text-grey-7">{{ classLevel.grades }}</div>
              </div>
            </div>
          </q-expansion-item>
          
          <div class="q-mt-lg column q-gutter-sm">
            <q-btn unelevated rounded no-caps label="Login" to="/login" class="q-py-md" />
            <q-btn unelevated rounded no-caps label="Sign Up" to="/register" color="dark" class="q-py-md" />
          </div>
        </div>
      </div>
    </q-drawer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Navigation state
const isScrolled = ref(false)
const activeSection = ref('home')
const showMegaMenu = ref(false)
const mobileMenuOpen = ref(false)

// Navigation links
const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'contact', label: 'Contact' }
]

// Class levels for mega menu
const classLevels = [
  { id: 'primary', title: 'Primary', grades: 'Grades 1-5', icon: 'school', color: 'green' },
  { id: 'junior', title: 'Junior', grades: 'Grades 6-9', icon: 'menu_book', color: 'cyan' },
  { id: 'ol', title: 'O/L Ordinary Level', grades: 'Grades 10-11', icon: 'star', color: 'orange' },
  { id: 'al', title: 'A/L Advanced Level', grades: 'Grades 12-13', icon: 'workspace_premium', color: 'secondary' }
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    // Close mobile menu if open
    mobileMenuOpen.value = false
  }
}

// Scroll spy logic
function handleScroll() {
  // Update scrolled state for nav bar
  isScrolled.value = window.scrollY > 50
  
  // Detect active section
  const sections = ['home', 'about', 'classes', 'facilities', 'contact']
  const scrollPosition = window.scrollY + 200
  
  for (const sectionId of sections) {
    const section = document.getElementById(sectionId)
    if (section) {
      const sectionTop = section.offsetTop
      const sectionBottom = sectionTop + section.offsetHeight
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeSection.value = sectionId
        break
      }
    }
  }
}

// Scroll reveal logic
let observer = null

onMounted(() => {
  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial call
  
  // Scroll reveal observer
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
  window.removeEventListener('scroll', handleScroll)
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

/* ========================================
   FLOATING NAVIGATION STYLES
======================================== */

/* Nav Container */
.nav-container {
  position: sticky;
  top: 20px;
  z-index: 1000;
  padding: 0 20px;
  pointer-events: none;
}

/* Floating Nav Bar */
.floating-nav {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 12px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  pointer-events: all;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.floating-nav.scrolled {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* Nav Inner Container */
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

/* Logo */
.nav-logo {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
}

/* Nav Links Container */
.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

/* Individual Nav Links */
.nav-link {
  position: relative;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #4B5563;
  cursor: pointer;
  transition: color 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: #1F2937;
}

/* Active Link Indicator */
.nav-link-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 24px;
  height: 2px;
  background: #2563EB;
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.nav-link.active .nav-link-indicator {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.active {
  color: #2563EB;
}

/* Nav Link Wrapper (for mega menu) */
.nav-link-wrapper {
  position: relative;
}

/* Mega Menu */
.mega-menu {
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.5);
  min-width: 500px;
}

.mega-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.mega-menu-item {
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.mega-menu-item:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* Mega Menu Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* Auth Buttons */
.nav-auth {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* Mobile Menu Drawer */
.mobile-menu {
  background: white;
}

.mobile-nav-link {
  display: block;
  padding: 12px 0;
  color: #1F2937;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
}

.mobile-nav-link:hover {
  color: #2563EB;
}

.mobile-class-item {
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.mobile-class-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

/* Mobile Responsive Adjustments */
@media (max-width: 1023px) {
  .nav-container {
    top: 10px;
    padding: 0 12px;
  }
  
  .floating-nav {
    border-radius: 40px;
    padding: 10px 16px;
  }
  
  .nav-inner {
    gap: 16px;
  }
}

/* ========================================
   EXISTING STYLES (Background, etc.)
======================================== */

/* Backgrounds & Text */
.text-dark { color: #0F172A !important; }
.bg-grey-1 { background-color: #F8FAFC !important; }
.border-top-light { border-top: 1px solid #E2E8F0; }

/* Hero Animations */
.hero-section {
  position: relative;
}

.blob-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0) 80%);
  border-radius: 50%;
  transform: translate(30%, -30%);
}
.blob-2 {
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(234,179,8,0.06) 0%, rgba(255,255,255,0) 80%);
  border-radius: 50%;
  transform: translate(-30%, 30%);
}
.glow-center {
  width: 900px; height: 900px;
  background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0) 80%);
  border-radius: 50%;
  filter: blur(80px);
}

.bg-grid {
  background-image: 
    linear-gradient(#e5e7eb 1px, transparent 1px),
    linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
  background-size: 40px 40px;
}

.opacity-10 { opacity: 0.08; }

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
