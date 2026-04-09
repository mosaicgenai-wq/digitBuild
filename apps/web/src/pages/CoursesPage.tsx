import { ArrowRight, Atom, ChartColumn, Check, CreditCard, Database, Lock, MessageCircle, Smartphone, Terminal, TestTube, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const categories = ['All', 'Development', 'Testing', 'Analytics'];
const whatsappNumber = '+917385490573';
const courses = [
  {
    title: 'Full Stack Development',
    icon: Terminal,
    cat: 'Development',
    duration: '6 Months',
    highlights: ['MERN Stack', 'APIs & Deployment', 'Real Projects'],
    timeline: '24 weeks with live sessions, projects, and placement prep.',
    curriculum: ['HTML, CSS, JavaScript fundamentals', 'React, Node.js, Express, MongoDB', 'Live capstone, Git, deployment, interview readiness'],
    learn: ['Build responsive frontend interfaces with React', 'Design REST APIs and connect databases securely', 'Handle authentication, deployment, and version control workflows'],
    outcomes: ['Portfolio-ready full stack projects', 'Confidence in frontend + backend interview rounds', 'Job-ready understanding of production web app architecture'],
  },
  {
    title: 'React JS',
    icon: Atom,
    cat: 'Development',
    duration: '3 Months',
    highlights: ['Hooks & State', 'Next.js Basics', 'Portfolio Build'],
    timeline: '12 weeks focused on frontend projects and modern React workflows.',
    curriculum: ['React foundations and component architecture', 'Routing, forms, APIs, state management', 'Portfolio app, optimization, deployment basics'],
    learn: ['Create reusable components and scalable UI structure', 'Work with APIs, forms, routing, and client-side state', 'Understand performance basics and modern frontend workflows'],
    outcomes: ['A polished frontend portfolio app', 'Stronger React-specific project discussions', 'Readiness for junior frontend developer roles'],
  },
  {
    title: 'Python',
    icon: Terminal,
    cat: 'Development',
    duration: '4 Months',
    highlights: ['Core Python', 'Django', 'Data Structures'],
    timeline: '16 weeks from Python basics to backend project delivery.',
    curriculum: ['Core Python and problem solving', 'Django, REST APIs, database integration', 'Mini projects, debugging, coding interview practice'],
    learn: ['Write clean Python scripts and solve programming problems', 'Build backend applications with Django and APIs', 'Use data structures and debugging practices effectively'],
    outcomes: ['Strong programming fundamentals', 'Hands-on backend project experience', 'Better preparation for Python and backend interviews'],
  },
  {
    title: 'Mobile Apps',
    icon: Smartphone,
    cat: 'Development',
    duration: '5 Months',
    highlights: ['React Native', 'Cross-platform', 'App Store Ready'],
    timeline: '20 weeks with hands-on mobile UI, API, and release preparation.',
    curriculum: ['React Native fundamentals and navigation', 'Device APIs, forms, auth, backend integration', 'Production-style app build and publishing checklist'],
    learn: ['Build mobile UI flows for Android and iOS from one codebase', 'Integrate authentication, APIs, and native device capabilities', 'Prepare apps for testing, release, and deployment reviews'],
    outcomes: ['A real cross-platform mobile project', 'Understanding of production mobile app workflows', 'Readiness for React Native developer opportunities'],
  },
  {
    title: 'QA & Testing',
    icon: TestTube,
    cat: 'Testing',
    duration: '4 Months',
    highlights: ['Selenium & Cypress', 'API Testing', 'CI/CD'],
    timeline: '16 weeks of manual testing, automation, and reporting workflows.',
    curriculum: ['Testing concepts, bug lifecycle, test cases', 'Selenium, Cypress, API and regression testing', 'Framework setup, CI basics, mock interview prep'],
    learn: ['Write test cases, bug reports, and regression plans', 'Automate browser and API testing with modern tools', 'Understand QA workflows in agile teams and delivery pipelines'],
    outcomes: ['Practical testing and automation exposure', 'Experience discussing QA scenarios and defects clearly', 'Readiness for manual and automation QA roles'],
  },
  {
    title: 'Business Analytics',
    icon: ChartColumn,
    cat: 'Analytics',
    duration: '3 Months',
    highlights: ['Excel & SQL', 'Power BI', 'Case Studies'],
    timeline: '12 weeks focused on dashboards, SQL, and business reporting.',
    curriculum: ['Excel, SQL, KPIs, and reporting basics', 'Power BI dashboards and stakeholder storytelling', 'Case studies, interview tasks, portfolio review'],
    learn: ['Work with business datasets using Excel and SQL', 'Create dashboards and reports for decision-making', 'Present insights in a way that non-technical stakeholders understand'],
    outcomes: ['Case-study based analytics portfolio pieces', 'Stronger KPI, reporting, and dashboard fundamentals', 'Preparation for analyst and reporting roles'],
  },
  {
    title: 'Data Analytics',
    icon: Database,
    cat: 'Analytics',
    duration: '4 Months',
    highlights: ['Python for Data', 'Statistics', 'Real Datasets'],
    timeline: '16 weeks of analytics workflows, real datasets, and insights reporting.',
    curriculum: ['Python, Excel, SQL, and exploratory analysis', 'Statistics, data cleaning, and visualization', 'Projects with dashboards, insights, and presentation practice'],
    learn: ['Clean, analyze, and visualize data using common analytics tools', 'Use statistics to interpret patterns and validate findings', 'Turn raw data into business-friendly reports and dashboards'],
    outcomes: ['Hands-on analytics projects with real datasets', 'Practical experience with end-to-end analysis workflow', 'Readiness for data analyst entry-level interviews'],
  },
  {
    title: 'Data Science',
    icon: Database,
    cat: 'Analytics',
    duration: '6 Months',
    highlights: ['Machine Learning', 'Deep Learning', 'Capstone'],
    timeline: '24 weeks from data foundations to machine learning capstone work.',
    curriculum: ['Python, EDA, feature engineering, and statistics', 'Machine learning, model evaluation, and deployment basics', 'Capstone project, portfolio support, and interview prep'],
    learn: ['Build machine learning workflows from problem framing to evaluation', 'Work with feature engineering, model selection, and experimentation', 'Understand basic deployment and real-world data science decision making'],
    outcomes: ['A capstone that demonstrates full data science workflow', 'Better understanding of ML concepts beyond tutorials', 'Preparation for junior data science and ML analyst roles'],
  },
];

export default function CoursesPage() {
  const [category, setCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<(typeof courses)[number] | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const filtered = category === 'All' ? courses : courses.filter((course) => course.cat === category);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedCourse) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [selectedCourse]);

  function getWhatsappLink(courseTitle: string) {
    const message = `Hi DigitBuild, I want to know more about the ${courseTitle} course.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function openCourseDetails(course: (typeof courses)[number]) {
    setSelectedCourse(course);
  }

  function closeCourseDetails() {
    setSelectedCourse(null);
  }

  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-courses">
        <div className="container-custom">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Courses</SectionEyebrow>
            <SectionTitle as="h1" className="mb-3">
              Learn what the industry <span className="hero-title-muted">actually needs</span>
            </SectionTitle>
            <p className="page-hero-copy">8 programs built by practitioners. Focused on outcomes, not theory.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="filter-row">
              {categories.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`filter-chip ${category === item ? 'is-active' : ''}`}>
                  {item}
                </button>
              ))}
            </div>
          </Reveal>
          <h2 className="sr-only">Available courses</h2>
          <div className="card-grid card-grid-3">
            {filtered.map((course, index) => {
              return (
                <Reveal key={course.title} delay={index * 0.05}>
                  <div className="course-card">
                    <div className="course-card-bar" />
                    <div className="course-card-body">
                      <course.icon className="info-icon" strokeWidth={1.5} />
                      <h3>{course.title}</h3>
                      <div className="feature-list">
                        {course.highlights.map((item) => (
                          <div key={item} className="feature-item">
                            <Check className="feature-check" />
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="course-card-duration">
                        <span className="duration-chip">{course.duration}</span>
                      </div>
                      <div className="course-card-actions">
                        <button type="button" className="inline-link inline-link-button" onClick={() => openCourseDetails(course)}>
                          Learn more <ArrowRight className="inline-link-icon" />
                        </button>
                        <a href={getWhatsappLink(course.title)} target="_blank" rel="noreferrer" className="whatsapp-link whatsapp-link-card">
                          <MessageCircle className="inline-link-icon" />
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="course-modal"
        onClose={closeCourseDetails}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeCourseDetails();
          }
        }}
      >
        {selectedCourse ? (
          <div className="course-modal-panel" aria-labelledby="course-modal-title" aria-describedby="course-modal-desc">
            <div className="course-modal-header">
              <div>
                <span className="course-modal-kicker">{selectedCourse.cat}</span>
                <h2 id="course-modal-title" className="course-modal-title">
                  {selectedCourse.title}
                </h2>
                <p id="course-modal-desc" className="course-modal-copy">
                  {selectedCourse.timeline}
                </p>
              </div>
              <button type="button" className="course-modal-close" onClick={closeCourseDetails} aria-label="Close course details" autoFocus>
                <X />
              </button>
            </div>

            <div className="course-modal-highlights">
              {selectedCourse.highlights.map((item) => (
                <span key={item} className="course-modal-highlight">
                  <Check className="feature-check" />
                  {item}
                </span>
              ))}
            </div>

            <div className="course-detail-panel course-detail-panel-modal">
              <div className="course-detail-block">
                <p className="course-detail-label">Curriculum</p>
                <ul className="course-detail-list">
                  {selectedCourse.curriculum.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="course-detail-block">
                <p className="course-detail-label">Duration</p>
                <p className="course-detail-copy">{selectedCourse.duration}</p>
              </div>
            </div>

            <div className="course-modal-grid">
              <div className="course-detail-panel course-detail-panel-modal">
                <div className="course-detail-block">
                  <p className="course-detail-label">What you will learn</p>
                  <ul className="course-detail-list">
                    {selectedCourse.learn.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="course-detail-panel course-detail-panel-modal">
                <div className="course-detail-block">
                  <p className="course-detail-label">By the end of the course</p>
                  <ul className="course-detail-list">
                    {selectedCourse.outcomes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="course-detail-actions course-detail-actions-modal">
              <a href={getWhatsappLink(selectedCourse.title)} target="_blank" rel="noreferrer" className="btn btn-pill btn-sm">
                Enroll Now
              </a>
              <button type="button" className="course-payment-button" disabled aria-disabled="true">
                <CreditCard className="course-payment-icon" />
                <span>Pay Securely</span>
                <span className="course-payment-status">
                  <Lock className="course-payment-lock" />
                  Phase 2
                </span>
              </button>
            </div>
            <p className="course-payment-note">Online Razorpay checkout will be enabled in phase 2.</p>
          </div>
        ) : null}
      </dialog>
    </main>
  );
}
