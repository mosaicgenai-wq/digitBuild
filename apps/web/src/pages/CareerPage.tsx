import { ArrowRight, BriefcaseBusiness, Clock3, Edit2, MapPin, Plus, Send, Trash2, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { sanityClient } from '../lib/sanity';
import { useSanityData } from '../lib/useSanityData';
import { useToast } from '../components/toast/ToastProvider';

interface CareerOpening {
  _id?: string;
  _createdAt?: string;
  id?: string;
  title: string;
  type: string;
  location: string;
  mode: string;
  team: string;
  summary: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  applyNote: string;
}

const openings: CareerOpening[] = [
  {
    title: 'Frontend Developer Intern',
    type: 'Internship',
    location: 'Pune / Hybrid',
    mode: 'Full-time',
    team: 'Product Design and Frontend',
    summary: 'Work on modern React interfaces, component systems, and landing pages for live client and internal products.',
    overview:
      'You will support our frontend team in designing polished user journeys, improving component quality, and shipping responsive experiences that feel fast, clean, and trustworthy.',
    responsibilities: [
      'Build responsive React and TypeScript UI sections from Figma-style direction and product briefs.',
      'Improve reusable components, landing pages, and motion details across the marketing and product experience.',
      'Work closely with mentors to debug UI issues, tighten accessibility, and maintain visual consistency.',
    ],
    requirements: [
      'Comfort with HTML, CSS, JavaScript, and React fundamentals.',
      'A sharp eye for spacing, typography, and responsive layouts.',
      'Willingness to learn quickly, take feedback well, and iterate with the team.',
    ],
    perks: ['Mentored learning plan', 'Portfolio-worthy live work', 'Opportunity to convert into a trainee role'],
    applyNote: 'Best fit for candidates who enjoy UI craft, frontend polish, and building clean digital experiences.',
  },
  {
    title: 'Full Stack Developer Trainee',
    type: 'Trainee',
    location: 'Pune',
    mode: 'Full-time',
    team: 'Engineering',
    summary: 'Learn and contribute across frontend, backend, APIs, and deployment workflows with mentor guidance.',
    overview:
      'This role is built for candidates who want structured exposure to real development work. You will move beyond tutorials and contribute to production-style features across the stack.',
    responsibilities: [
      'Assist in building frontend screens, backend APIs, and database-connected features.',
      'Participate in bug fixing, code reviews, and deployment-oriented engineering workflows.',
      'Collaborate with mentors on debugging, project architecture, and practical development standards.',
    ],
    requirements: [
      'Basic knowledge of JavaScript and at least one frontend or backend framework.',
      'Understanding of APIs, Git, and programming fundamentals.',
      'Strong ownership mindset and interest in growing into a full stack product engineer.',
    ],
    perks: ['Cross-functional project exposure', 'Hands-on mentor reviews', 'Placement-focused growth roadmap'],
    applyNote: 'A strong option for learners ready to become execution-focused developers with real delivery discipline.',
  },
  {
    title: 'Business Development Associate',
    type: 'Entry Level',
    location: 'Pune / On-site',
    mode: 'Full-time',
    team: 'Growth and Partnerships',
    summary: 'Help grow enrollments, partnerships, and client conversations with a practical sales and relationship focus.',
    overview:
      'You will help DigitBuild grow by building trust with prospects, explaining our offerings clearly, and supporting the pipeline from first conversation to conversion.',
    responsibilities: [
      'Handle inbound leads, explain programs clearly, and maintain timely follow-ups.',
      'Support outreach for partnerships, collaborations, and service conversations.',
      'Track conversations, share customer insights, and help improve the sales process.',
    ],
    requirements: [
      'Strong communication and relationship-building skills.',
      'Comfort speaking with students, working professionals, and business leads.',
      'Organized follow-through and confidence in a target-oriented environment.',
    ],
    perks: ['Direct revenue exposure', 'Sales and communication mentoring', 'Growth path into partnerships and account management'],
    applyNote: 'Great for candidates who enjoy people-facing work and want to grow in business, sales, and partnerships.',
  },
];

const process = ['Apply with resume', 'Shortlisting', 'Discussion round', 'Task or assessment', 'Final decision'];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function serializeList(items: string[] = []) {
  return items.join('\n');
}

function parseList(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

export default function CareerPage() {
  const { showToast } = useToast();
  const { data: sanityOpenings, loading, error } = useSanityData<CareerOpening[]>(`*[_type == "careerOpening"] | order(_createdAt desc)`);
  const [careerOpenings, setCareerOpenings] = useState<CareerOpening[]>(openings);
  const [selectedOpening, setSelectedOpening] = useState<CareerOpening | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSeededOpenings, setHasSeededOpenings] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);
  const [manageData, setManageData] = useState<any>({
    title: '',
    type: 'Full-time',
    location: '',
    mode: 'Full-time',
    team: '',
    summary: '',
    overview: '',
    responsibilities: '',
    requirements: '',
    perks: '',
    applyNote: '',
  });
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const manageDialogRef = useRef<HTMLDialogElement | null>(null);
  const confirmDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userRole') === 'admin');
  }, []);

  useEffect(() => {
    if (sanityOpenings && sanityOpenings.length > 0) {
      setCareerOpenings(sanityOpenings.map((opening) => ({ ...opening, id: opening.id || opening._id })));
    }
  }, [sanityOpenings]);

  useEffect(() => {
    const seedDefaultOpenings = async () => {
      if (!isAdmin || hasSeededOpenings || loading || !sanityOpenings || sanityOpenings.length > 0) return;
      setHasSeededOpenings(true);

      try {
        await Promise.all(
          openings.map((opening) =>
            sanityClient.createIfNotExists({
              ...opening,
              _id: `careerOpening-${slugify(opening.title)}`,
              _type: 'careerOpening',
            }),
          ),
        );
        await fetchCareerOpenings();
      } catch (err) {
        console.error('Career seed error:', err);
      }
    };

    void seedDefaultOpenings();
  }, [hasSeededOpenings, isAdmin, loading, sanityOpenings]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedOpening) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [selectedOpening]);

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

  async function fetchCareerOpenings() {
    try {
      const data = await sanityClient.fetch<CareerOpening[]>(`*[_type == "careerOpening"] | order(_createdAt desc)`);
      setCareerOpenings(data.map((opening) => ({ ...opening, id: opening.id || opening._id })));
    } catch (err) {
      console.error('Failed to fetch career openings');
    }
  }

  function openOpeningDetails(opening: CareerOpening) {
    setSelectedOpening(opening);
  }

  function closeOpeningDetails() {
    setSelectedOpening(null);
  }

  function openManage(opening?: CareerOpening) {
    if (opening) {
      setManageData({
        ...opening,
        responsibilities: serializeList(opening.responsibilities),
        requirements: serializeList(opening.requirements),
        perks: serializeList(opening.perks),
      });
    } else {
      setManageData({
        title: '',
        type: 'Full-time',
        location: '',
        mode: 'Full-time',
        team: '',
        summary: '',
        overview: '',
        responsibilities: '',
        requirements: '',
        perks: '',
        applyNote: '',
      });
    }
    setIsManaging(true);
  }

  async function handleSaveOpening(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      _type: 'careerOpening',
      title: manageData.title,
      type: manageData.type,
      location: manageData.location,
      mode: manageData.mode,
      team: manageData.team,
      summary: manageData.summary,
      overview: manageData.overview,
      responsibilities: parseList(manageData.responsibilities),
      requirements: parseList(manageData.requirements),
      perks: parseList(manageData.perks),
      applyNote: manageData.applyNote,
    };

    try {
      if (manageData._id) {
        await sanityClient.patch(manageData._id).set(payload).commit();
      } else {
        await sanityClient.create(payload);
      }
      setIsManaging(false);
      await fetchCareerOpenings();
      showToast('Opening Saved', `${payload.title} has been updated successfully.`, 'success');
    } catch (err) {
      console.error('Career save error:', err);
      showToast('Save Failed', 'Could not save the career opening. Check your Sanity token permissions.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!isConfirmingDelete) return;
    setIsSaving(true);
    try {
      await sanityClient.delete(isConfirmingDelete);
      setIsConfirmingDelete(null);
      if (selectedOpening?._id === isConfirmingDelete) setSelectedOpening(null);
      await fetchCareerOpenings();
      showToast('Opening Deleted', 'The career opening has been removed.', 'success');
    } catch (err) {
      console.error('Career delete error:', err);
      showToast('Delete Failed', 'You do not have permission to delete this career opening.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-career">
        <div className="container-custom narrow-center">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Career</SectionEyebrow>
            <h1 className="page-hero-title">
              Join us in building <span className="page-hero-muted">real opportunities</span>
            </h1>
            <p className="page-hero-copy">
              Explore internships, trainee roles, and growth-focused openings. Click any card to view the full job description before you apply.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding surface-section">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Open Roles</SectionEyebrow>
            <SectionTitle className="mb-12">Current and upcoming openings</SectionTitle>
          </Reveal>
          {isAdmin && (
            <div className="flex-between mb-12">
              <span className="time-chip">Admin mode</span>
              <button onClick={() => openManage()} className="btn btn-sm btn-minimalist" style={{ border: '1px solid hsl(var(--border))', borderRadius: '0.75rem', padding: '0.5rem 1rem' }}>
                <Plus size={16} /> New Opening
              </button>
            </div>
          )}

          <div className="career-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                <p>Loading openings...</p>
              </div>
            ) : error && careerOpenings.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'hsl(var(--destructive))' }}>
                <p>Error: {error}</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Showing local career content when Sanity is unavailable.</p>
              </div>
            ) : careerOpenings.map((opening, index) => (
              <Reveal key={opening.title} delay={index * 0.06}>
                <div
                  className="career-card career-card-button"
                  role="button"
                  tabIndex={0}
                  onClick={() => openOpeningDetails(opening)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openOpeningDetails(opening);
                    }
                  }}
                >
                  <div className="career-card-top">
                    <span className="duration-chip">{opening.type}</span>
                    {isAdmin && opening._id ? (
                      <div className="admin-actions">
                        <button type="button" onClick={(event) => { event.stopPropagation(); openManage(opening); }} className="icon-btn-small" title="Edit"><Edit2 size={14} /></button>
                        <button type="button" onClick={(event) => { event.stopPropagation(); setIsConfirmingDelete(opening._id || null); }} className="icon-btn-small text-danger" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    ) : (
                      <BriefcaseBusiness className="info-icon career-icon" strokeWidth={1.8} />
                    )}
                  </div>
                  <h3>{opening.title}</h3>
                  <p className="career-summary">{opening.summary}</p>
                  <div className="career-meta">
                    <span><MapPin className="career-meta-icon" />{opening.location}</span>
                    <span><Clock3 className="career-meta-icon" />{opening.mode}</span>
                    <span><Users className="career-meta-icon" />{opening.team}</span>
                  </div>
                  <div className="career-actions">
                    <span className="career-cta-text">
                      View job description <ArrowRight className="inline-link-icon" />
                    </span>
                    <ButtonLink
                      to="/contact"
                      variant="pill-outline"
                      size="sm"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Ask about role
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Hiring Flow</SectionEyebrow>
            <SectionTitle className="mb-12">Simple and transparent process</SectionTitle>
          </Reveal>

          <div className="career-process">
            {process.map((step, index) => (
              <Reveal key={step} delay={index * 0.05}>
                <div className="career-process-step">
                  <span className="support-step-index">{index + 1}</span>
                  <span>{step}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container-custom center-text">
          <Reveal>
            <SectionTitle className="mb-3">Want to be considered for future openings?</SectionTitle>
            <ButtonLink to="/contact">
              Connect with us <ArrowRight className="btn-icon" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="course-modal"
        onClose={closeOpeningDetails}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeOpeningDetails();
          }
        }}
      >
        {selectedOpening ? (
          <div className="course-modal-panel" aria-labelledby="career-modal-title" aria-describedby="career-modal-desc">
            <div className="course-modal-header">
              <div>
                <span className="course-modal-kicker">{selectedOpening.type}</span>
                <h2 id="career-modal-title" className="course-modal-title">
                  {selectedOpening.title}
                </h2>
                <p id="career-modal-desc" className="course-modal-copy">
                  {selectedOpening.overview}
                </p>
              </div>
              <button type="button" className="course-modal-close" onClick={closeOpeningDetails} aria-label="Close job description" autoFocus>
                <X />
              </button>
            </div>

            <div className="course-modal-highlights">
              <span className="course-modal-highlight"><MapPin className="feature-check" />{selectedOpening.location}</span>
              <span className="course-modal-highlight"><Clock3 className="feature-check" />{selectedOpening.mode}</span>
              <span className="course-modal-highlight"><Users className="feature-check" />{selectedOpening.team}</span>
            </div>

            <div className="career-modal-grid">
              <div className="course-detail-panel course-detail-panel-modal">
                <div className="course-detail-block">
                  <p className="course-detail-label">Key Responsibilities</p>
                  <ul className="career-modal-list">
                    {selectedOpening.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="course-detail-panel course-detail-panel-modal">
                <div className="course-detail-block">
                  <p className="course-detail-label">What We Are Looking For</p>
                  <ul className="career-modal-list">
                    {selectedOpening.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="course-detail-panel course-detail-panel-modal">
              <div className="course-detail-block">
                <p className="course-detail-label">Why This Role Can Be Exciting</p>
                <ul className="career-modal-list">
                  {selectedOpening.perks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="career-modal-note">{selectedOpening.applyNote}</div>

            <div className="course-detail-actions course-detail-actions-modal">
              <a href={`mailto:marutidigitbuild@gmail.com?subject=${encodeURIComponent(`Application for ${selectedOpening.title}`)}`} className="btn btn-pill btn-sm">
                Apply now <Send className="btn-icon" />
              </a>
              <ButtonLink to="/contact" variant="pill-outline" size="sm">
                Ask about role
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </dialog>

      <dialog ref={manageDialogRef} className="course-modal" onClose={() => setIsManaging(false)}>
        <div className="admin-modal-panel">
          <div className="admin-header">
            <h2>{manageData._id ? 'Refine Opening' : 'Create New Opening'}</h2>
            <button type="button" className="course-modal-close" onClick={() => setIsManaging(false)}><X /></button>
          </div>

          <form onSubmit={handleSaveOpening}>
            <div className="admin-form-body">
              <div className="form-section">
                <span className="form-section-title">Role Information</span>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Role Title</label>
                    <input className="admin-input" type="text" value={manageData.title} onChange={event => setManageData({...manageData, title: event.target.value})} required placeholder="e.g. Frontend Developer Intern" />
                  </div>
                  <div className="admin-field">
                    <label>Role Type</label>
                    <input className="admin-input" type="text" value={manageData.type} onChange={event => setManageData({...manageData, type: event.target.value})} required placeholder="e.g. Internship" />
                  </div>
                  <div className="admin-field">
                    <label>Location</label>
                    <input className="admin-input" type="text" value={manageData.location} onChange={event => setManageData({...manageData, location: event.target.value})} required placeholder="e.g. Pune / Hybrid" />
                  </div>
                  <div className="admin-field">
                    <label>Mode</label>
                    <input className="admin-input" type="text" value={manageData.mode} onChange={event => setManageData({...manageData, mode: event.target.value})} required placeholder="e.g. Full-time" />
                  </div>
                  <div className="admin-field">
                    <label>Team</label>
                    <input className="admin-input" type="text" value={manageData.team} onChange={event => setManageData({...manageData, team: event.target.value})} required placeholder="e.g. Engineering" />
                  </div>
                  <div className="admin-field">
                    <label>Card Summary</label>
                    <input className="admin-input" type="text" value={manageData.summary} onChange={event => setManageData({...manageData, summary: event.target.value})} required placeholder="Short role summary" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <span className="form-section-title">Job Description</span>
                <div className="admin-field">
                  <label>Overview</label>
                  <textarea className="admin-textarea" value={manageData.overview} onChange={event => setManageData({...manageData, overview: event.target.value})} required placeholder="Describe the role..." />
                </div>
                <div className="admin-form-grid" style={{ marginTop: '1rem' }}>
                  <div className="admin-field">
                    <label>Responsibilities (One per line)</label>
                    <textarea className="admin-textarea" value={manageData.responsibilities} onChange={event => setManageData({...manageData, responsibilities: event.target.value})} required placeholder="Responsibility 1&#10;Responsibility 2" />
                  </div>
                  <div className="admin-field">
                    <label>Requirements (One per line)</label>
                    <textarea className="admin-textarea" value={manageData.requirements} onChange={event => setManageData({...manageData, requirements: event.target.value})} required placeholder="Requirement 1&#10;Requirement 2" />
                  </div>
                  <div className="admin-field">
                    <label>Perks (One per line)</label>
                    <textarea className="admin-textarea" value={manageData.perks} onChange={event => setManageData({...manageData, perks: event.target.value})} placeholder="Perk 1&#10;Perk 2" />
                  </div>
                  <div className="admin-field">
                    <label>Apply Note</label>
                    <textarea className="admin-textarea" value={manageData.applyNote} onChange={event => setManageData({...manageData, applyNote: event.target.value})} required placeholder="Best fit note for candidates..." />
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

      <dialog ref={confirmDialogRef} className="course-modal" onClose={() => setIsConfirmingDelete(null)}>
        <div className="confirm-modal-panel glass">
          <div className="confirm-icon-wrap">
            <Trash2 size={32} />
          </div>
          <h2 className="confirm-title">Are you sure?</h2>
          <p className="confirm-text">
            This action will permanently delete the career opening. This cannot be undone.
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
