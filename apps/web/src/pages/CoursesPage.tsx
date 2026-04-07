import { ArrowRight, Atom, ChartColumn, Check, Database, MessageCircle, Smartphone, Terminal, TestTube } from 'lucide-react';
import { useState } from 'react';
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
  },
  {
    title: 'React JS',
    icon: Atom,
    cat: 'Development',
    duration: '3 Months',
    highlights: ['Hooks & State', 'Next.js Basics', 'Portfolio Build'],
    timeline: '12 weeks focused on frontend projects and modern React workflows.',
    curriculum: ['React foundations and component architecture', 'Routing, forms, APIs, state management', 'Portfolio app, optimization, deployment basics'],
  },
  {
    title: 'Python',
    icon: Terminal,
    cat: 'Development',
    duration: '4 Months',
    highlights: ['Core Python', 'Django', 'Data Structures'],
    timeline: '16 weeks from Python basics to backend project delivery.',
    curriculum: ['Core Python and problem solving', 'Django, REST APIs, database integration', 'Mini projects, debugging, coding interview practice'],
  },
  {
    title: 'Mobile Apps',
    icon: Smartphone,
    cat: 'Development',
    duration: '5 Months',
    highlights: ['React Native', 'Cross-platform', 'App Store Ready'],
    timeline: '20 weeks with hands-on mobile UI, API, and release preparation.',
    curriculum: ['React Native fundamentals and navigation', 'Device APIs, forms, auth, backend integration', 'Production-style app build and publishing checklist'],
  },
  {
    title: 'QA & Testing',
    icon: TestTube,
    cat: 'Testing',
    duration: '4 Months',
    highlights: ['Selenium & Cypress', 'API Testing', 'CI/CD'],
    timeline: '16 weeks of manual testing, automation, and reporting workflows.',
    curriculum: ['Testing concepts, bug lifecycle, test cases', 'Selenium, Cypress, API and regression testing', 'Framework setup, CI basics, mock interview prep'],
  },
  {
    title: 'Business Analytics',
    icon: ChartColumn,
    cat: 'Analytics',
    duration: '3 Months',
    highlights: ['Excel & SQL', 'Power BI', 'Case Studies'],
    timeline: '12 weeks focused on dashboards, SQL, and business reporting.',
    curriculum: ['Excel, SQL, KPIs, and reporting basics', 'Power BI dashboards and stakeholder storytelling', 'Case studies, interview tasks, portfolio review'],
  },
  {
    title: 'Data Analytics',
    icon: Database,
    cat: 'Analytics',
    duration: '4 Months',
    highlights: ['Python for Data', 'Statistics', 'Real Datasets'],
    timeline: '16 weeks of analytics workflows, real datasets, and insights reporting.',
    curriculum: ['Python, Excel, SQL, and exploratory analysis', 'Statistics, data cleaning, and visualization', 'Projects with dashboards, insights, and presentation practice'],
  },
  {
    title: 'Data Science',
    icon: Database,
    cat: 'Analytics',
    duration: '6 Months',
    highlights: ['Machine Learning', 'Deep Learning', 'Capstone'],
    timeline: '24 weeks from data foundations to machine learning capstone work.',
    curriculum: ['Python, EDA, feature engineering, and statistics', 'Machine learning, model evaluation, and deployment basics', 'Capstone project, portfolio support, and interview prep'],
  },
];

export default function CoursesPage() {
  const [category, setCategory] = useState('All');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const filtered = category === 'All' ? courses : courses.filter((course) => course.cat === category);

  function getWhatsappLink(courseTitle: string) {
    const message = `Hi DigitBuild, I want to know more about the ${courseTitle} course.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function toggleCourseDetails(courseTitle: string) {
    setExpandedCourse((current) => (current === courseTitle ? null : courseTitle));
  }

  return (
    <main className="pt-nav">
      <section className="section-padding">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Courses</SectionEyebrow>
            <SectionTitle className="mb-3">
              Learn what the industry <span className="hero-title-muted">actually needs</span>
            </SectionTitle>
            <p className="page-hero-copy left-copy">8 programs built by practitioners. Focused on outcomes, not theory.</p>
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
          <div className="card-grid card-grid-3">
            {filtered.map((course, index) => {
              const isExpanded = expandedCourse === course.title;

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
                      <div className="course-footer">
                        <span className="duration-chip">{course.duration}</span>
                        <button type="button" className="inline-link inline-link-button" onClick={() => toggleCourseDetails(course.title)}>
                          {isExpanded ? 'Hide details' : 'Learn more'} <ArrowRight className="inline-link-icon" />
                        </button>
                      </div>

                      {isExpanded ? (
                        <div className="course-detail-panel">
                          <div className="course-detail-block">
                            <p className="course-detail-label">Curriculum</p>
                            <ul className="course-detail-list">
                              {course.curriculum.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="course-detail-block">
                            <p className="course-detail-label">Timeline</p>
                            <p className="course-detail-copy">{course.timeline}</p>
                          </div>
                          <div className="course-detail-actions">
                            <a href={getWhatsappLink(course.title)} target="_blank" rel="noreferrer" className="btn btn-pill btn-sm">
                              Enroll Now
                            </a>
                          </div>
                        </div>
                      ) : null}

                      <a href={getWhatsappLink(course.title)} target="_blank" rel="noreferrer" className="whatsapp-link">
                        <MessageCircle className="inline-link-icon" />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

