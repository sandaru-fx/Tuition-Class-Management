<template>
  <q-page class="bg-dark text-white overflow-hidden">
    
    <!-- Hero Section -->
    <div class="hero-section relative-position window-height flex flex-center">
      <q-parallax :height="height" :speed="0.5">
        <template v-slot:media>
          <img src="~assets/hero-abstract.png" style="opacity: 0.3; filter: contrast(1.3) brightness(0.7);">
          <!-- Academic Gradient Overlay -->
          <div class="absolute-full" style="background: radial-gradient(circle at 30% 50%, rgba(30, 58, 138, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(217, 119, 6, 0.1) 0%, transparent 50%);"></div>
        </template>

        <template v-slot:content="scope">
          <div class="absolute column items-center q-pa-md text-center" 
               :style="{
                 opacity: 1 - scope.percentScrolled,
                 transform: `translateY(${scope.percentScrolled * 50}px)`
               }">
             
            <h1 class="text-super-large text-uppercase q-mb-md fade-in-up text-gradient-academic" style="animation-delay: 0.2s">
              Academic<br>Excellence,<br>Simplified.
            </h1>
            
            <p class="text-h5 text-grey-4 q-mb-lg fade-in-up" style="animation-delay: 0.4s; max-width: 700px; line-height: 1.6;">
              Empower your institution with advanced analytics, multi-campus management, and research tracking—all in one unified platform.
            </p>

            <div class="row q-gutter-sm items-center fade-in-up" style="animation-delay: 0.6s">
              <q-btn 
                rounded 
                unelevated
                color="primary" 
                text-color="white" 
                label="Get Started" 
                size="lg" 
                class="q-px-xl q-py-sm text-weight-bold glow-blue"
                no-caps
                to="/register"
              />
              <q-btn 
                rounded 
                outline
                color="white" 
                label="Watch Demo" 
                size="lg" 
                class="q-px-xl q-py-sm text-weight-bold"
                no-caps
                icon="play_circle"
              />
            </div>

            <!-- Trust Badges -->
            <div class="row q-gutter-md q-mt-xl fade-in-up" style="animation-delay: 0.8s">
              <div class="badge-academic">ISO 27001 Certified</div>
              <div class="badge-academic">GDPR Compliant</div>
              <div class="badge-academic">99.9% Uptime</div>
            </div>
          </div>
        </template>
      </q-parallax>
    </div>

    <!-- Problem & Solution Section -->
    <div class="q-py-xl q-px-md bg-black">
      <div class="container q-mx-auto" style="max-width: 1200px">
        
        <!-- Section Title -->
        <div class="text-center q-mb-xl scroll-reveal" ref="whyTitle">
          <h2 class="text-h3 text-weight-bold text-gradient-academic q-mb-sm">Why ClassMaster?</h2>
          <p class="text-grey-5">Solving the real challenges in higher education management</p>
        </div>

        <!-- Problem-Solution Grid -->
        <div class="row q-col-gutter-xl">
          
          <!-- Problems Column -->
          <div class="col-12 col-md-6 scroll-reveal delay-1" ref="problemsCol">
            <div class="q-mb-lg">
              <h3 class="text-h5 text-weight-bold q-mb-md" style="color: #EF4444">The Challenge</h3>
              <p class="text-grey-6">Common pain points in traditional education management</p>
            </div>

            <!-- Problem 1 -->
            <div class="glass-card-premium q-pa-lg q-mb-md rounded-xl" style="border-left: 3px solid #EF4444">
              <div class="row items-center q-gutter-md">
                <q-icon name="table_chart" size="40px" color="red-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Drowning in Spreadsheets</div>
                  <div class="text-caption text-grey-5">Manual data entry across disconnected systems wastes hours daily</div>
                </div>
              </div>
            </div>

            <!-- Problem 2 -->
            <div class="glass-card-premium q-pa-lg q-mb-md rounded-xl" style="border-left: 3px solid #EF4444">
              <div class="row items-center q-gutter-md">
                <q-icon name="payments" size="40px" color="red-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Payment Tracking Chaos</div>
                  <div class="text-caption text-grey-5">Missed payments, manual invoicing, and reconciliation nightmares</div>
                </div>
              </div>
            </div>

            <!-- Problem 3 -->
            <div class="glass-card-premium q-pa-lg q-mb-md rounded-xl" style="border-left: 3px solid #EF4444">
              <div class="row items-center q-gutter-md">
                <q-icon name="event_busy" size="40px" color="red-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Scheduling Conflicts</div>
                  <div class="text-caption text-grey-5">Double-bookings, room conflicts, and last-minute changes</div>
                </div>
              </div>
            </div>

            <!-- Problem 4 -->
            <div class="glass-card-premium q-pa-lg rounded-xl" style="border-left: 3px solid #EF4444">
              <div class="row items-center q-gutter-md">
                <q-icon name="visibility_off" size="40px" color="red-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Limited Visibility</div>
                  <div class="text-caption text-grey-5">No real-time insights into student performance or institutional metrics</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Solutions Column -->
          <div class="col-12 col-md-6 scroll-reveal delay-2" ref="solutionsCol">
            <div class="q-mb-lg">
              <h3 class="text-h5 text-weight-bold q-mb-md" style="color: #10B981">The ClassMaster Solution</h3>
              <p class="text-grey-6">Modern tools that transform how you work</p>
            </div>

            <!-- Solution 1 -->
            <div class="glass-card-premium q-pa-lg q-mb-md rounded-xl" style="border-left: 3px solid #10B981">
              <div class="row items-center q-gutter-md">
                <q-icon name="integration_instructions" size="40px" color="green-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Unified Platform</div>
                  <div class="text-caption text-grey-5">All data in one place with automated workflows and real-time sync</div>
                </div>
              </div>
            </div>

            <!-- Solution 2 -->
            <div class="glass-card-premium q-pa-lg q-mb-md rounded-xl" style="border-left: 3px solid #10B981">
              <div class="row items-center q-gutter-md">
                <q-icon name="account_balance_wallet" size="40px" color="green-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Automated Finance</div>
                  <div class="text-caption text-grey-5">Smart invoicing, payment tracking, and instant reconciliation</div>
                </div>
              </div>
            </div>

            <!-- Solution 3 -->
            <div class="glass-card-premium q-pa-lg q-mb-md rounded-xl" style="border-left: 3px solid #10B981">
              <div class="row items-center q-gutter-md">
                <q-icon name="auto_awesome" size="40px" color="green-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Intelligent Scheduling</div>
                  <div class="text-caption text-grey-5">AI-powered conflict resolution with instant notifications</div>
                </div>
              </div>
            </div>

            <!-- Solution 4 -->
            <div class="glass-card-premium q-pa-lg rounded-xl" style="border-left: 3px solid #10B981">
              <div class="row items-center q-gutter-md">
                <q-icon name="insights" size="40px" color="green-5" />
                <div class="col">
                  <div class="text-weight-bold q-mb-xs">Advanced Analytics</div>
                  <div class="text-caption text-grey-5">Real-time dashboards with actionable insights and predictive analytics</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Dashboard Preview Section -->
    <div class="q-py-xl q-px-md bg-black relative-position">
      <div class="text-center q-mb-xl scroll-reveal" ref="dashboardPreview">
        <h2 class="text-h3 text-weight-bold text-gradient-academic q-mb-sm">See It In Action</h2>
        <p class="text-grey-5">Real-time insights for institutional excellence</p>
      </div>

      <div class="container q-mx-auto scroll-reveal delay-1" style="max-width: 1200px" ref="dashboardMockup">
        <div class="glass-card-premium q-pa-lg rounded-xl glow-subtle">
          <div class="row q-col-gutter-md">
            <!-- Mock Dashboard Cards -->
            <div class="col-12 col-md-4">
              <div class="q-pa-md bg-white-10 rounded-borders">
                <div class="text-caption text-grey-5 q-mb-xs">Total Students</div>
                <div class="text-h4 text-weight-bold">50,247</div>
                <div class="text-caption text-green q-mt-xs">↑ 12% this semester</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="q-pa-md bg-white-10 rounded-borders">
                <div class="text-caption text-grey-5 q-mb-xs">Active Departments</div>
                <div class="text-h4 text-weight-bold">524</div>
                <div class="text-caption text-blue q-mt-xs">Across 12 campuses</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="q-pa-md bg-white-10 rounded-borders">
                <div class="text-caption text-grey-5 q-mb-xs">Research Publications</div>
                <div class="text-h4 text-weight-bold">1,847</div>
                <div class="text-caption text-amber q-mt-xs">This academic year</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section - Academic Focus -->
    <div class="q-py-xl q-px-md bg-dark relative-position">
      <div class="text-center q-mb-xl scroll-reveal" ref="featuresTitle">
        <h2 class="text-h3 text-weight-bold text-gradient-academic">Built for Higher Education</h2>
        <div class="text-grey-6">Comprehensive tools for modern institutions</div>
      </div>

      <div class="row q-col-gutter-xl container q-mx-auto" style="max-width: 1200px">
        
        <!-- Feature 1: Advanced Analytics -->
        <div class="col-12 col-md-6 scroll-reveal delay-1" ref="feature1">
          <div class="glass-card-premium column q-pa-xl rounded-borders h-100">
             <q-icon name="analytics" size="60px" color="primary" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold q-mb-sm">Advanced Analytics & Reporting</h3>
             <p class="text-grey-5">Track academic performance, research output, and institutional metrics with comprehensive dashboards tailored for higher education.</p>
          </div>
        </div>

        <!-- Feature 2: Multi-Department Management -->
        <div class="col-12 col-md-6 scroll-reveal delay-2" ref="feature2">
          <div class="glass-card-premium column q-pa-xl rounded-borders h-100">
             <q-icon name="account_tree" size="60px" color="amber" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold q-mb-sm">Multi-Department Management</h3>
             <p class="text-grey-5">Seamlessly manage multiple faculties, departments, and campuses from one unified platform with role-based access control.</p>
          </div>
        </div>

        <!-- Feature 3: Research Tracking -->
        <div class="col-12 col-md-6 scroll-reveal delay-3" ref="feature3">
          <div class="glass-card-premium column q-pa-xl rounded-borders h-100">
             <q-icon name="menu_book" size="60px" color="green" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold q-mb-sm">Research & Publication Tracking</h3>
             <p class="text-grey-5">Monitor research projects, publications, and academic contributions across your institution with detailed analytics.</p>
          </div>
        </div>

        <!-- Feature 4: Accreditation -->
        <div class="col-12 col-md-6 scroll-reveal delay-4" ref="feature4">
          <div class="glass-card-premium column q-pa-xl rounded-borders h-100">
             <q-icon name="verified" size="60px" color="blue-4" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold q-mb-sm">Accreditation & Compliance</h3>
             <p class="text-grey-5">Maintain compliance with educational standards and accreditation requirements effortlessly with automated reporting.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Stats Section -->
    <div class="q-py-xl bg-black text-center scroll-reveal" ref="statsSection">
      <div class="row justify-center q-col-gutter-lg">
        <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder text-gradient-academic">500+</div>
          <div class="text-uppercase text-caption letter-spacing-2 text-grey-5">Departments Managed</div>
        </div>
        <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder text-gradient-academic">50,000+</div>
          <div class="text-uppercase text-caption letter-spacing-2 text-grey-5">Students Enrolled</div>
        </div>
        <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder text-gradient-academic">99.9%</div>
          <div class="text-uppercase text-caption letter-spacing-2 text-grey-5">Uptime Guarantee</div>
        </div>
      </div>
    </div>

    <!-- Free Platform / Community Section -->
    <div class="q-py-xl q-px-md bg-dark">
      <div class="text-center q-mb-xl scroll-reveal" ref="communityTitle">
        <h2 class="text-h3 text-weight-bold text-gradient-academic">Free & Open for All Institutions</h2>
        <p class="text-grey-5">No hidden costs. No subscriptions. Just powerful tools for education.</p>
      </div>

      <div class="row q-col-gutter-lg container q-mx-auto" style="max-width: 1200px">
        
        <!-- Free Forever -->
        <div class="col-12 col-md-4 scroll-reveal delay-1" ref="community1">
          <div class="glass-card-premium q-pa-xl rounded-xl text-center h-100 glow-blue" style="border: 2px solid rgba(59, 130, 246, 0.3)">
            <q-icon name="favorite" size="60px" color="red-5" class="q-mb-md" />
            <h3 class="text-h5 text-weight-bold q-mb-sm">100% Free</h3>
            <p class="text-grey-5">
              No pricing tiers, no premium features locked behind paywalls. Every feature is available to every institution, completely free.
            </p>
          </div>
        </div>

        <!-- Open Source -->
        <div class="col-12 col-md-4 scroll-reveal delay-2" ref="community2">
          <div class="glass-card-premium q-pa-xl rounded-xl text-center h-100">
            <q-icon name="code" size="60px" color="green-5" class="q-mb-md" />
            <h3 class="text-h5 text-weight-bold q-mb-sm">Open Source</h3>
            <p class="text-grey-5">
              Built with transparency in mind. Customize, extend, and adapt the platform to your institution's unique needs.
            </p>
          </div>
        </div>

        <!-- Community Driven -->
        <div class="col-12 col-md-4 scroll-reveal delay-3" ref="community3">
          <div class="glass-card-premium q-pa-xl rounded-xl text-center h-100">
            <q-icon name="groups" size="60px" color="amber-5" class="q-mb-md" />
            <h3 class="text-h5 text-weight-bold q-mb-sm">Community Driven</h3>
            <p class="text-grey-5">
              Join a growing community of educators and developers working together to improve educational technology.
            </p>
          </div>
        </div>

      </div>

      <!-- What You Get -->
      <div class="text-center q-mt-xl scroll-reveal delay-4" ref="features">
        <div class="container q-mx-auto" style="max-width: 900px">
          <div class="glass-card-premium q-pa-xl rounded-xl">
            <h4 class="text-h6 text-weight-bold q-mb-lg">Everything Included</h4>
            <div class="row q-col-gutter-md text-left">
              <div class="col-12 col-sm-6">
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Unlimited Students & Departments</div>
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Advanced Analytics & Reporting</div>
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Multi-Campus Management</div>
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Research Tracking</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Role-Based Access Control</div>
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Secure Data Management</div>
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Regular Updates</div>
                <div class="q-mb-sm"><q-icon name="check_circle" color="green" /> Community Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="q-py-xl q-px-md bg-black">
      <div class="text-center q-mb-xl scroll-reveal" ref="faqTitle">
        <h2 class="text-h3 text-weight-bold text-gradient-academic">Frequently Asked Questions</h2>
        <p class="text-grey-5">Everything you need to know</p>
      </div>

      <div class="container q-mx-auto scroll-reveal delay-1" style="max-width: 800px" ref="faqList">
        <q-list dark class="glass-card-premium rounded-xl">
          <q-expansion-item
            dark
            v-for="(faq, index) in faqs"
            :key="index"
            :label="faq.question"
            header-class="text-weight-bold"
            expand-icon-class="text-primary"
          >
            <q-card dark class="bg-transparent">
              <q-card-section class="text-grey-5">
                {{ faq.answer }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>

    <!-- Footer / CTA -->
    <div class="q-py-xl bg-black text-center border-top-white-10">
      <h2 class="text-h4 text-weight-bold q-mb-lg text-gradient-academic">Ready to Transform Your Institution?</h2>
      <p class="text-grey-5 q-mb-lg">Get started today - no credit card required, no setup fees</p>
      
      <div class="row justify-center q-gutter-md q-mb-xl">
        <q-btn 
          unelevated
          rounded
          color="primary" 
          label="Get Started Free" 
          size="lg" 
          no-caps 
          class="q-px-xl glow-blue"
          to="/register"
        />
        <q-btn 
          outline
          rounded
          color="white" 
          label="View Documentation" 
          size="lg" 
          no-caps 
          class="q-px-xl"
          icon="menu_book"
        />
      </div>

      <div class="text-grey-7 text-caption">
        &copy; 2026 Academic Management System. Free & Open Source.
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const height = ref(800)

const faqs = ref([
  {
    question: 'How does multi-campus management work?',
    answer: 'Our platform allows you to manage multiple campuses from a single dashboard. Each campus can have its own departments, students, and staff, while maintaining centralized reporting and analytics.'
  },
  {
    question: 'Is the system compliant with educational data regulations?',
    answer: 'Yes, we are fully compliant with FERPA, GDPR, and other major educational data protection regulations. All data is encrypted at rest and in transit, and we maintain ISO 27001 certification.'
  },
  {
    question: 'Can we integrate with existing student information systems?',
    answer: 'Absolutely! We offer robust API access and pre-built integrations with major SIS platforms. Our team can also help with custom integrations for your specific needs.'
  },
  {
    question: 'What kind of analytics and reporting is available?',
    answer: 'We provide comprehensive analytics including student performance tracking, research output metrics, departmental analytics, financial reporting, and custom dashboards tailored to your institution\'s KPIs.'
  },
  {
    question: 'What support options are available?',
    answer: 'All plans include email support. Professional plans get priority support with faster response times. Enterprise customers receive dedicated account managers and 24/7 phone support.'
  }
])

// Scroll reveal logic
let observer = null

onMounted(() => {
  height.value = $q.screen.height

  // Initialize Intersection Observer for scroll reveals
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
      }
    })
  }, {
    threshold: 0.1
  })

  // Observe all scroll-reveal elements
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
