import { ArrowRight, Atom, ChartColumn, Check, CreditCard, Database, Edit2, Lock, MessageCircle, Plus, Smartphone, Terminal, TestTube, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { sanityClient } from '../lib/sanity';
import { useSanityData } from '../lib/useSanityData';

const categories = ['All', 'Development', 'Testing', 'Analytics'];
const whatsappNumber = '+917385490573';

const iconMap: Record<string, any> = {
  Terminal, Atom, Smartphone, TestTube, ChartColumn, Database
};

interface Course {
  _id?: string;
  _createdAt?: string;
  id?: string;
  title: string;
  icon: string;
  cat: string;
  duration: string;
  highlights: string[];
  timeline: string;
  curriculum: string[];
  learn: string[];
  outcomes: string[];
}

export default function CoursesPage() {
  const { data: sanityCourses, loading, error } = useSanityData<Course[]>(`*[_type == "course"] | order(_createdAt desc)`);
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [manageData, setManageData] = useState<any>({
    title: '', icon: 'Terminal', cat: 'Development', duration: '', highlights: '', timeline: '', curriculum: '', learn: '', outcomes: ''
  });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);
  
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const manageDialogRef = useRef<HTMLDialogElement | null>(null);
  const confirmDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('userRole') === 'admin');
  }, []);

  useEffect(() => {
    if (sanityCourses) {
      // Ensure each course has an id property for compatibility
      setCourses(sanityCourses.map(c => ({ ...c, id: c.id || c._id })));
    }
  }, [sanityCourses]);

  const fetchCourses = async () => {
    try {
      const data = await sanityClient.fetch<Course[]>(`*[_type == "course"] | order(_createdAt desc)`);
      setCourses(data.map((c) => ({ ...c, id: c.id || c._id })));
    } catch (err) {
      console.error('Failed to fetch courses');
    }
  };

  const filtered = category === 'All' ? courses : courses.filter((course) => course.cat === category);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedCourse && !isManaging && !isConfirmingDelete) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedCourse, isManaging, isConfirmingDelete]);

  useEffect(() => {
    const dialog = manageDialogRef.current;
    if (!dialog) return;
    if (isManaging) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isManaging]);

  useEffect(() => {
    const dialog = confirmDialogRef.current;
    if (!dialog) return;
    if (isConfirmingDelete) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isConfirmingDelete]);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      _type: 'course',
      title: manageData.title,
      icon: manageData.icon,
      cat: manageData.cat,
      duration: manageData.duration,
      timeline: manageData.timeline,
      highlights: manageData.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean),
      curriculum: manageData.curriculum.split('\n').map((s: string) => s.trim()).filter(Boolean),
      learn: manageData.learn.split('\n').map((s: string) => s.trim()).filter(Boolean),
      outcomes: manageData.outcomes.split('\n').map((s: string) => s.trim()).filter(Boolean),
    };

    try {
      if (manageData._id) {
        await sanityClient.patch(manageData._id).set(payload).commit();
      } else {
        await sanityClient.create(payload);
      }
      setIsManaging(false);
      await fetchCourses();
      alert('Course saved successfully');
    } catch (err) {
      console.error('Sanity Error:', err);
      alert('Failed to save course. Ensure your Sanity Token has write access.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!isConfirmingDelete) return;
    setIsSaving(true);
    try {
      await sanityClient.delete(isConfirmingDelete);
      setIsConfirmingDelete(null);
      await fetchCourses();
      alert('Course deleted successfully');
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete course. Check your Sanity token permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const openManage = (course?: any) => {
    if (course) {
      setManageData({
        ...course,
        highlights: course.highlights?.join('\n') || '',
        curriculum: course.curriculum?.join('\n') || '',
        learn: course.learn?.join('\n') || '',
        outcomes: course.outcomes?.join('\n') || '',
      });
    } else {
      setManageData({ 
        title: '', icon: 'Terminal', cat: 'Development', duration: '', 
        highlights: '', timeline: '', curriculum: '', learn: '', outcomes: '' 
      });
    }
    setIsManaging(true);
  };

  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-courses">
        <div className="container-custom">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Course Catalog</SectionEyebrow>
            <SectionTitle as="h1" className="mb-4">
              Explore Our <span className="hero-title-muted">Programs</span>
            </SectionTitle>
            <p className="page-hero-copy">Manage and view our industry-leading training programs.</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex-between mb-12">
              <div className="filter-row" style={{ margin: 0 }}>
                {categories.map((item) => (
                  <button key={item} type="button" onClick={() => setCategory(item)} className={`filter-chip ${category === item ? 'is-active' : ''}`}>
                    {item}
                  </button>
                ))}
              </div>
              {isAdmin && (
                <button onClick={() => openManage()} className="btn btn-sm btn-minimalist" style={{ border: '1px solid hsl(var(--border))', borderRadius: '0.75rem', padding: '0.5rem 1rem' }}>
                  <Plus size={16} /> New Program
                </button>
              )}
            </div>
          </Reveal>

          <div className="card-grid card-grid-3">
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                <p>Loading programs...</p>
              </div>
            ) : error ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'hsl(var(--destructive))' }}>
                <p>Error: {error}</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Check your Sanity Project ID and Dataset in .env</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                <p>No programs found for this category.</p>
              </div>
            ) : filtered.map((course, index) => {
              const Icon = iconMap[course.icon] || Terminal;
              return (
                <Reveal key={course.id || course.title} delay={index * 0.05}>
                  <div className="course-card">
                    <div className="course-card-bar" />
                    <div className="course-card-body">
                      <div className="flex-between mb-4">
                        <div className="flex gap-3 align-center">
                          <div className="icon-badge">
                            <Icon size={20} strokeWidth={1.5} />
                          </div>
                          <h3 className="course-title-small">{course.title}</h3>
                        </div>
                        {isAdmin && (
                          <div className="admin-actions">
                            <button onClick={() => openManage(course)} className="icon-btn-small" title="Edit"><Edit2 size={14} /></button>
                            <button onClick={() => setIsConfirmingDelete(course.id || null)} className="icon-btn-small text-danger" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        )}
                      </div>
                      <div className="feature-list mb-6">
                        {course.highlights?.slice(0, 3).map((item: string) => (
                          <div key={item} className="feature-item" style={{ fontWeight: 500 }}>
                            <Check className="feature-check" />
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="flex-between mt-auto">
                        <span className="duration-chip" style={{ fontWeight: 600 }}>{course.duration}</span>
                        <button type="button" className="inline-link" style={{ border: 'none', background: 'transparent', fontWeight: 600 }} onClick={() => setSelectedCourse(course)}>
                          View Details <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* View Course Details Dialog */}
      <dialog ref={dialogRef} className="course-modal" onClose={() => setSelectedCourse(null)}>
        {selectedCourse && (
          <div className="course-modal-panel">
            <div className="course-modal-header">
              <div>
                <span className="course-modal-kicker">{selectedCourse.cat}</span>
                <h2 className="course-modal-title" style={{ fontWeight: 700 }}>{selectedCourse.title}</h2>
                <p className="course-modal-copy">{selectedCourse.timeline}</p>
              </div>
              <button type="button" className="course-modal-close" onClick={() => setSelectedCourse(null)}><X /></button>
            </div>
            
            <div style={{ padding: '0 2rem 2rem' }}>
              <div className="course-modal-highlights" style={{ marginBottom: '1.5rem' }}>
                {selectedCourse.highlights?.map((item: string) => (
                  <span key={item} className="course-modal-highlight"><Check className="feature-check" />{item}</span>
                ))}
              </div>

              <div className="course-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="course-detail-panel course-detail-panel-modal">
                  <p className="course-detail-label">CURRICULUM OVERVIEW</p>
                  <ul className="course-detail-list">{selectedCourse.curriculum?.map((item: string) => <li key={item}>{item}</li>)}</ul>
                </div>

                <div className="course-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="course-detail-panel course-detail-panel-modal">
                    <p className="course-detail-label">KEY OBJECTIVES</p>
                    <ul className="course-detail-list">{selectedCourse.learn?.map((item: string) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div className="course-detail-panel course-detail-panel-modal">
                    <p className="course-detail-label">CAREER OUTCOMES</p>
                    <ul className="course-detail-list">{selectedCourse.outcomes?.map((item: string) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>

      {/* Admin Manage Course Dialog */}
      <dialog ref={manageDialogRef} className="course-modal" onClose={() => setIsManaging(false)}>
        <div className="admin-modal-panel">
          <div className="admin-header">
            <h2>{manageData.id ? 'Refine Course' : 'Create New Program'}</h2>
            <button type="button" className="course-modal-close" onClick={() => setIsManaging(false)}><X /></button>
          </div>
          
          <form onSubmit={handleSaveCourse}>
            <div className="admin-form-body">
              <div className="form-section">
                <span className="form-section-title">General Information</span>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Course Title</label>
                    <input className="admin-input" type="text" value={manageData.title} onChange={e => setManageData({...manageData, title: e.target.value})} required placeholder="e.g. Advanced Cloud Computing" />
                  </div>
                  <div className="admin-field">
                    <label>Category</label>
                    <select className="admin-select" value={manageData.cat} onChange={e => setManageData({...manageData, cat: e.target.value})}>
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Duration</label>
                    <input className="admin-input" type="text" value={manageData.duration} onChange={e => setManageData({...manageData, duration: e.target.value})} required placeholder="e.g. 6 Months" />
                  </div>
                  <div className="admin-field">
                    <label>Display Icon</label>
                    <select className="admin-select" value={manageData.icon} onChange={e => setManageData({...manageData, icon: e.target.value})}>
                      {Object.keys(iconMap).map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <span className="form-section-title">Timeline & Structure</span>
                <div className="admin-field">
                  <label>Timeline Description</label>
                  <textarea className="admin-textarea" value={manageData.timeline} onChange={e => setManageData({...manageData, timeline: e.target.value})} required placeholder="Describe the course schedule and major milestones..." />
                </div>
              </div>

              <div className="form-section">
                <span className="form-section-title">Content & Outcomes</span>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Highlights (One per line)</label>
                    <textarea className="admin-textarea" value={manageData.highlights} onChange={e => setManageData({...manageData, highlights: e.target.value})} placeholder="Feature 1&#10;Feature 2" />
                  </div>
                  <div className="admin-field">
                    <label>Curriculum (One per line)</label>
                    <textarea className="admin-textarea" value={manageData.curriculum} onChange={e => setManageData({...manageData, curriculum: e.target.value})} placeholder="Module 1&#10;Module 2" />
                  </div>
                  <div className="admin-field">
                    <label>Learning Objectives (One per line)</label>
                    <textarea className="admin-textarea" value={manageData.learn} onChange={e => setManageData({...manageData, learn: e.target.value})} placeholder="Objective 1&#10;Objective 2" />
                  </div>
                  <div className="admin-field">
                    <label>Career Outcomes (One per line)</label>
                    <textarea className="admin-textarea" value={manageData.outcomes} onChange={e => setManageData({...manageData, outcomes: e.target.value})} placeholder="Role 1&#10;Role 2" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="admin-footer">
              <button type="button" className="btn-admin-cancel" onClick={() => setIsManaging(false)} disabled={isSaving}>Cancel</button>
              <button type="submit" className="btn-admin-save" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Double Confirmation Delete Dialog */}
      <dialog ref={confirmDialogRef} className="course-modal" onClose={() => setIsConfirmingDelete(null)}>
        <div className="confirm-modal-panel glass">
          <div className="confirm-icon-wrap">
            <Trash2 size={32} />
          </div>
          <h2 className="confirm-title">Are you sure?</h2>
          <p className="confirm-text">
            This action will permanently delete the course and all associated data. This cannot be undone.
          </p>
          <div className="confirm-actions">
            <button className="btn btn-ghost flex-1" onClick={() => setIsConfirmingDelete(null)} disabled={isSaving}>No, Cancel</button>
            <button className="btn btn-danger flex-1" onClick={confirmDelete} disabled={isSaving}>
              {isSaving ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
