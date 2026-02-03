<template>
  <q-page class="bg-white text-academic-dark overflow-hidden">
    
    <!-- Hero Section -->
    <div class="hero-section relative-position window-height flex flex-center bg-academic-white overflow-hidden hero-pattern-light">
      <div class="container q-mx-auto q-px-md" style="max-width: 1400px; z-index: 2">
        <div class="row items-center q-col-gutter-xl">
          
          <!-- Left Content -->
          <div class="col-12 col-md-6 text-left fade-in-up">
            <div class="badge-light q-mb-md inline-block">The Unified OS for Higher Education</div>
            
            <h1 class="text-h2 text-weight-bolder q-mb-md text-academic-blue" style="line-height: 1.1; font-size: clamp(2.5rem, 5vw, 4.5rem);">
              Academic Excellence,<br>
              <span class="text-gradient-academic-light text-uppercase">Simplified.</span>
            </h1>
            
            <p class="text-h6 text-academic-medium q-mb-xl" style="max-width: 550px; line-height: 1.6;">
              Empower your institution with advanced analytics, multi-campus management, and research tracking—all in one unified, professional platform.
            </p>

            <div class="row q-gutter-md">
              <q-btn 
                unelevated
                rounded
                class="q-px-xl q-py-sm text-weight-bold btn-academic-primary"
                label="Get Started Free" 
                size="lg" 
                no-caps
                to="/register"
              />
              <q-btn 
                unelevated
                rounded
                class="q-px-xl q-py-sm text-weight-bold btn-academic-secondary"
                label="Watch Demo" 
                size="lg" 
                no-caps
                icon="play_circle"
              />
            </div>

            <!-- Trust Badges -->
            <div class="row q-gutter-md q-mt-xl opacity-80">
              <div class="row items-center q-gutter-xs">
                <q-icon name="verified_user" color="primary" />
                <span class="text-caption text-weight-bold">ISO 27001</span>
              </div>
              <div class="row items-center q-gutter-xs">
                <q-icon name="security" color="primary" />
                <span class="text-caption text-weight-bold">GDPR Ready</span>
              </div>
              <div class="row items-center q-gutter-xs">
                <q-icon name="cloud_done" color="primary" />
                <span class="text-caption text-weight-bold">99.9% Uptime</span>
              </div>
            </div>
          </div>

          <!-- Right Content: Dashboard Preview -->
          <div class="col-12 col-md-6 gt-sm fade-in-up" style="animation-delay: 0.4s">
            <div class="relative-position">
              <!-- Floating Abstract Shapes -->
              <div class="absolute-top-right rounded-circle bg-blue-1" style="width: 300px; height: 300px; filter: blur(100px); opacity: 0.5; z-index: -1"></div>
              
              <!-- Dashboard Mockup Card -->
              <div class="card-light-blue q-pa-md rounded-xl shadow-2xl overflow-hidden" style="border: 4px solid #fff; transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);">
                <div class="bg-academic-white rounded-lg q-pa-md border-light">
                  <div class="row items-center q-mb-md">
                    <div class="text-weight-bold text-academic-blue">Academic Insights</div>
                    <q-space />
                    <q-icon name="more_horiz" color="grey-7" />
                  </div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-6">
                      <div class="q-pa-md bg-academic-blue-light rounded-borders">
                        <div class="text-caption text-academic-medium">Students</div>
                        <div class="text-h6 text-weight-bold">50.2K</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="q-pa-md bg-green-1 rounded-borders">
                        <div class="text-caption text-academic-medium">Research</div>
                        <div class="text-h6 text-weight-bold">1.8K</div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="q-mt-sm bg-academic-light rounded-borders q-pa-sm" style="height: 120px">
                        <div class="row items-center q-gutter-xs q-mb-xs">
                          <div class="bg-primary rounded" style="width: 20px; height: 60px"></div>
                          <div class="bg-blue-4 rounded" style="width: 20px; height: 80px"></div>
                          <div class="bg-primary rounded" style="width: 20px; height: 40px"></div>
                          <div class="bg-blue-3 rounded" style="width: 20px; height: 90px"></div>
                          <div class="bg-primary rounded" style="width: 20px; height: 110px"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- Problem & Solution Section -->
    <div class="q-py-xl q-px-md bg-academic-light">
      <div class="container q-mx-auto" style="max-width: 1200px">
        
        <!-- Section Title -->
        <div class="text-center q-mb-xl scroll-reveal" ref="whyTitle">
          <h2 class="text-h3 text-weight-bold text-gradient-academic-light q-mb-sm">Why ClassMaster?</h2>
          <p class="text-academic-medium">Solving the real challenges in higher education management</p>
        </div>

        <!-- Problem-Solution Grid -->
        <div class="row q-col-gutter-xl">
          
          <!-- Problems Column -->
          <div class="col-12 col-md-6 scroll-reveal delay-1" ref="problemsCol">
            <div class="q-mb-lg">
              <h3 class="text-h5 text-weight-bold q-mb-md text-negative">The Challenge</h3>
              <p class="text-academic-medium">Common pain points in traditional education management</p>
            </div>

            <!-- Problem 1 -->
            <div class="card-light q-pa-lg q-mb-md rounded-xl" style="border-left: 4px solid #ef4444">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="table_chart" size="40px" color="negative" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Drowning in Spreadsheets</div>
                  <div class="text-caption text-academic-medium">Manual data entry across disconnected systems wastes hours daily</div>
                </div>
              </div>
            </div>

            <!-- Problem 2 -->
            <div class="card-light q-pa-lg q-mb-md rounded-xl" style="border-left: 4px solid #ef4444">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="payments" size="40px" color="negative" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Payment Tracking Chaos</div>
                  <div class="text-caption text-academic-medium">Missed payments, manual invoicing, and reconciliation nightmares</div>
                </div>
              </div>
            </div>

            <!-- Problem 3 -->
            <div class="card-light q-pa-lg q-mb-md rounded-xl" style="border-left: 4px solid #ef4444">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="event_busy" size="40px" color="negative" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Scheduling Conflicts</div>
                  <div class="text-caption text-academic-medium">Double-bookings, room conflicts, and last-minute changes</div>
                </div>
              </div>
            </div>

            <!-- Problem 4 -->
            <div class="card-light q-pa-lg rounded-xl" style="border-left: 4px solid #ef4444">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="visibility_off" size="40px" color="negative" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Limited Visibility</div>
                  <div class="text-caption text-academic-medium">No real-time insights into student performance or institutional metrics</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Solutions Column -->
          <div class="col-12 col-md-6 scroll-reveal delay-2" ref="solutionsCol">
            <div class="q-mb-lg">
              <h3 class="text-h5 text-weight-bold q-mb-md text-positive">The ClassMaster Solution</h3>
              <p class="text-academic-medium">Modern tools that transform how you work</p>
            </div>

            <!-- Solution 1 -->
            <div class="card-light q-pa-lg q-mb-md rounded-xl" style="border-left: 4px solid #10b981">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="integration_instructions" size="40px" color="positive" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Unified Platform</div>
                  <div class="text-caption text-academic-medium">All data in one place with automated workflows and real-time sync</div>
                </div>
              </div>
            </div>

            <!-- Solution 2 -->
            <div class="card-light q-pa-lg q-mb-md rounded-xl" style="border-left: 4px solid #10b981">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="account_balance_wallet" size="40px" color="positive" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Automated Finance</div>
                  <div class="text-caption text-academic-medium">Smart invoicing, payment tracking, and instant reconciliation</div>
                </div>
              </div>
            </div>

            <!-- Solution 3 -->
            <div class="card-light q-pa-lg q-mb-md rounded-xl" style="border-left: 4px solid #10b981">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="auto_awesome" size="40px" color="positive" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Intelligent Scheduling</div>
                  <div class="text-caption text-academic-medium">AI-powered conflict resolution with instant notifications</div>
                </div>
              </div>
            </div>

            <!-- Solution 4 -->
            <div class="card-light q-pa-lg rounded-xl" style="border-left: 4px solid #10b981">
              <div class="row items-center q-gutter-md no-wrap">
                <q-icon name="insights" size="40px" color="positive" />
                <div class="col">
                  <div class="text-weight-bold text-academic-dark q-mb-xs">Advanced Analytics</div>
                  <div class="text-caption text-academic-medium">Real-time dashboards with actionable insights and predictive analytics</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Dashboard Preview Section -->
    <div class="q-py-xl q-px-md bg-white relative-position">
      <div class="text-center q-mb-xl scroll-reveal" ref="dashboardPreview">
        <h2 class="text-h3 text-weight-bold text-gradient-academic-light q-mb-sm">See It In Action</h2>
        <p class="text-academic-medium">Real-time insights for institutional excellence</p>
      </div>

      <div class="container q-mx-auto scroll-reveal delay-1" style="max-width: 1200px" ref="dashboardMockup">
        <div class="card-light-blue q-pa-lg rounded-xl">
          <div class="row q-col-gutter-md">
            <!-- Mock Dashboard Cards -->
            <div class="col-12 col-md-4">
              <div class="q-pa-md bg-academic-blue-light rounded-borders">
                <div class="text-caption text-academic-medium q-mb-xs">Total Students</div>
                <div class="text-h4 text-weight-bold text-academic-dark">50,247</div>
                <div class="text-caption text-positive q-mt-xs text-weight-bold">↑ 12% this semester</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="q-pa-md bg-academic-blue-light rounded-borders">
                <div class="text-caption text-academic-medium q-mb-xs">Active Departments</div>
                <div class="text-h4 text-weight-bold text-academic-dark">524</div>
                <div class="text-caption text-primary q-mt-xs text-weight-bold">Across 12 campuses</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="q-pa-md bg-academic-blue-light rounded-borders">
                <div class="text-caption text-academic-medium q-mb-xs">Research Publications</div>
                <div class="text-h4 text-weight-bold text-academic-dark">1,847</div>
                <div class="text-caption text-warning q-mt-xs text-weight-bold">This academic year</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section - Academic Focus -->
    <div class="q-py-xl q-px-md bg-academic-light relative-position">
      <div class="text-center q-mb-xl scroll-reveal" ref="featuresTitle">
        <h2 class="text-h3 text-weight-bold text-gradient-academic-light">Built for Higher Education</h2>
        <p class="text-academic-medium">Comprehensive tools for modern institutions</p>
      </div>

      <div class="row q-col-gutter-xl container q-mx-auto" style="max-width: 1200px">
        
        <!-- Feature 1: Advanced Analytics -->
        <div class="col-12 col-md-6 scroll-reveal delay-1" ref="feature1">
          <div class="card-light column q-pa-xl rounded-xl h-100">
             <q-icon name="analytics" size="60px" color="primary" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold text-academic-dark q-mb-sm">Advanced Analytics & Reporting</h3>
             <p class="text-academic-medium">Track academic performance, research output, and institutional metrics with comprehensive dashboards tailored for higher education.</p>
          </div>
        </div>

        <!-- Feature 2: Multi-Department Management -->
        <div class="col-12 col-md-6 scroll-reveal delay-2" ref="feature2">
          <div class="card-light column q-pa-xl rounded-xl h-100">
             <q-icon name="account_tree" size="60px" color="warning" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold text-academic-dark q-mb-sm">Multi-Department Management</h3>
             <p class="text-academic-medium">Seamlessly manage multiple faculties, departments, and campuses from one unified platform with role-based access control.</p>
          </div>
        </div>

        <!-- Feature 3: Research Tracking -->
        <div class="col-12 col-md-6 scroll-reveal delay-3" ref="feature3">
          <div class="card-light column q-pa-xl rounded-xl h-100">
             <q-icon name="menu_book" size="60px" color="positive" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold text-academic-dark q-mb-sm">Research & Publication Tracking</h3>
             <p class="text-academic-medium">Maintain a complete record of scholarly activities, research grants, and publications for faculty members and departments.</p>
          </div>
        </div>

        <!-- Feature 4: Accreditation -->
        <div class="col-12 col-md-6 scroll-reveal delay-4" ref="feature4">
          <div class="card-light column q-pa-xl rounded-xl h-100">
             <q-icon name="assignment_turned_in" size="60px" color="primary" class="q-mb-md" />
             <h3 class="text-h5 text-weight-bold text-academic-dark q-mb-sm">Accreditation & Compliance</h3>
             <p class="text-academic-medium">Automate document collection and reporting required for institutional accreditation and government compliance standards.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Stats Section -->
    <div class="q-py-xl bg-academic-blue-light text-center scroll-reveal" ref="statsSection">
      <div class="row justify-center q-col-gutter-lg">
        <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder text-gradient-academic-light">500+</div>
          <div class="text-uppercase text-caption letter-spacing-2 text-academic-medium">Departments Managed</div>
        </div>
        <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder text-gradient-academic-light">50,000+</div>
          <div class="text-uppercase text-caption letter-spacing-2 text-academic-medium">Students Enrolled</div>
        </div>
        <div class="col-12 col-sm-3">
          <div class="text-h2 text-weight-bolder text-gradient-academic-light">99.9%</div>
          <div class="text-uppercase text-caption letter-spacing-2 text-academic-medium">Uptime Guarantee</div>
        </div>
      </div>
    </div>

    <!-- Integration Ecosystem Section -->
    <div class="q-py-xl q-px-md bg-white">
      <div class="container q-mx-auto" style="max-width: 1200px">
        
        <!-- Section Title -->
        <div class="text-center q-mb-xl scroll-reveal" ref="integrationTitle">
          <h2 class="text-h3 text-weight-bold text-gradient-academic-light q-mb-sm">Seamlessly Integrates With Your Tools</h2>
          <p class="text-academic-medium">Connect with the services you already use</p>
        </div>

          <!-- Integration Grid -->
        <div class="row q-col-gutter-lg justify-center">
          
          <!-- Zoom Integration -->
          <div class="col-12 col-sm-6 col-md-4 scroll-reveal delay-1" ref="integration1">
            <div class="card-light q-pa-lg rounded-xl text-center h-100 integration-card">
              <q-icon name="videocam" size="60px" color="blue" class="q-mb-md" />
              <h4 class="text-h6 text-weight-bold text-academic-dark q-mb-sm">Zoom</h4>
              <p class="text-caption text-academic-medium">Live streaming and virtual classroom integration with automated recording</p>
            </div>
          </div>

          <!-- Stripe Integration -->
          <div class="col-12 col-sm-6 col-md-4 scroll-reveal delay-2" ref="integration2">
            <div class="card-light q-pa-lg rounded-xl text-center h-100 integration-card">
              <q-icon name="payment" size="60px" color="purple" class="q-mb-md" />
              <h4 class="text-h6 text-weight-bold text-academic-dark q-mb-sm">Stripe</h4>
              <p class="text-caption text-academic-medium">Secure payment processing with automated invoicing and reconciliation</p>
            </div>
          </div>

          <!-- Google Calendar Integration -->
          <div class="col-12 col-sm-6 col-md-4 scroll-reveal delay-3" ref="integration3">
            <div class="card-light q-pa-lg rounded-xl text-center h-100 integration-card">
              <q-icon name="event" size="60px" color="amber" class="q-mb-md" />
              <h4 class="text-h6 text-weight-bold text-academic-dark q-mb-sm">Google Calendar</h4>
              <p class="text-caption text-academic-medium">Sync schedules and send automatic reminders to students and staff</p>
            </div>
          </div>

          <!-- AWS S3 Integration -->
          <div class="col-12 col-sm-6 col-md-4 scroll-reveal delay-4" ref="integration4">
            <div class="card-light q-pa-lg rounded-xl text-center h-100 integration-card">
              <q-icon name="cloud" size="60px" color="orange" class="q-mb-md" />
              <h4 class="text-h6 text-weight-bold text-academic-dark q-mb-sm">AWS S3</h4>
              <p class="text-caption text-academic-medium">Secure cloud storage for documents, recordings, and student files</p>
            </div>
          </div>

          <!-- SendGrid Integration -->
          <div class="col-12 col-sm-6 col-md-4 scroll-reveal delay-5" ref="integration5">
            <div class="card-light q-pa-lg rounded-xl text-center h-100 integration-card">
              <q-icon name="email" size="60px" color="cyan" class="q-mb-md" />
              <h4 class="text-h6 text-weight-bold text-academic-dark q-mb-sm">SendGrid</h4>
              <p class="text-caption text-academic-medium">Automated email notifications and communication workflows</p>
            </div>
          </div>

          <!-- API Access -->
          <div class="col-12 col-sm-6 col-md-4 scroll-reveal delay-6" ref="integration6">
            <div class="card-light q-pa-lg rounded-xl text-center h-100 integration-card">
              <q-icon name="api" size="60px" color="green" class="q-mb-md" />
              <h4 class="text-h6 text-weight-bold text-academic-dark q-mb-sm">Custom API</h4>
              <p class="text-caption text-academic-medium">Build your own integrations with our comprehensive REST API</p>
            </div>
          </div>

        </div>

        <!-- Integration CTA -->
        <div class="text-center q-mt-xl scroll-reveal delay-7" ref="integrationCta">
          <p class="text-academic-medium q-mb-md">Need a specific integration? We're always expanding our ecosystem.</p>
          <q-btn unelevated rounded color="primary" label="View All Integrations" no-caps class="q-px-lg" />
        </div>

      </div>
    </div>

    <!-- Free Platform / Community Section -->
    <div class="q-py-xl q-px-md bg-academic-light">
      <div class="text-center q-mb-xl scroll-reveal" ref="communityTitle">
        <h2 class="text-h3 text-weight-bold text-gradient-academic-light">Free & Open for All Institutions</h2>
        <p class="text-academic-medium">No hidden costs. No subscriptions. Just powerful tools for education.</p>
      </div>

      <div class="row q-col-gutter-lg container q-mx-auto" style="max-width: 1200px">
        
        <!-- Free Forever -->
        <div class="col-12 col-md-4 scroll-reveal delay-1" ref="community1">
          <div class="card-light-blue q-pa-xl rounded-xl text-center h-100" style="border: 2px solid #DBEAFE">
            <q-icon name="favorite" size="60px" color="negative" class="q-mb-md" />
            <h3 class="text-h5 text-weight-bold text-academic-dark q-mb-sm">100% Free</h3>
            <p class="text-academic-medium">
              No pricing tiers, no premium features locked behind paywalls. Every feature is available to every institution, completely free.
            </p>
          </div>
        </div>

        <!-- Open Source -->
        <div class="col-12 col-md-4 scroll-reveal delay-2" ref="community2">
          <div class="card-light q-pa-xl rounded-xl text-center h-100">
            <q-icon name="code" size="60px" color="positive" class="q-mb-md" />
            <h3 class="text-h5 text-weight-bold text-academic-dark q-mb-sm">Open Source</h3>
            <p class="text-academic-medium">
              Built with transparency in mind. Customize, extend, and adapt the platform to your institution's unique needs.
            </p>
          </div>
        </div>

        <!-- Community Driven -->
        <div class="col-12 col-md-4 scroll-reveal delay-3" ref="community3">
          <div class="card-light q-pa-xl rounded-xl text-center h-100">
            <q-icon name="groups" size="60px" color="warning" class="q-mb-md" />
            <h3 class="text-h5 text-weight-bold text-academic-dark q-mb-sm">Community Driven</h3>
            <p class="text-academic-medium">
              Join a growing community of educators and developers working together to improve educational technology.
            </p>
          </div>
        </div>

      </div>

      <!-- What You Get -->
      <div class="text-center q-mt-xl scroll-reveal delay-4" ref="features">
        <div class="container q-mx-auto" style="max-width: 900px">
          <div class="card-light q-pa-xl rounded-xl">
            <h4 class="text-h6 text-weight-bold text-academic-dark q-mb-lg">Everything Included</h4>
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
    <div class="q-py-xl q-px-md bg-white">
      <div class="text-center q-mb-xl scroll-reveal" ref="faqTitle">
        <h2 class="text-h3 text-weight-bold text-gradient-academic-light">Frequently Asked Questions</h2>
        <p class="text-academic-medium">Everything you need to know</p>
      </div>

      <div class="container q-mx-auto scroll-reveal delay-1" style="max-width: 800px" ref="faqList">
        <q-list class="card-light rounded-xl">
          <q-expansion-item
            v-for="(faq, index) in faqs"
            :key="index"
            :label="faq.question"
            header-class="text-weight-bold text-academic-dark"
            expand-icon-class="text-primary"
          >
            <q-card class="bg-transparent">
              <q-card-section class="text-academic-medium">
                {{ faq.answer }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>

    <!-- Footer / CTA -->
    <div class="q-py-xl bg-academic-blue-dark text-center">
      <h2 class="text-h4 text-weight-bold q-mb-lg text-white">Ready to Transform Your Institution?</h2>
      <p class="text-white opacity-80 q-mb-lg">Get started today - no credit card required, no setup fees</p>
      
      <div class="row justify-center q-gutter-md q-mb-xl">
        <q-btn 
          unelevated
          rounded
          class="q-px-xl btn-academic-primary"
          label="Get Started Free" 
          size="lg" 
          no-caps 
          to="/register"
        />
        <q-btn 
          unelevated
          rounded
          class="q-px-xl btn-academic-secondary"
          label="View Documentation" 
          size="lg" 
          no-caps 
          icon="menu_book"
        />
      </div>

      <div class="text-grey-4 text-caption">
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
.opacity-80 {
  opacity: 0.8;
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
