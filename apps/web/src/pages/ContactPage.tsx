import { Mail, MapPin, Phone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { useToast } from '../components/toast/ToastProvider';
import type { ContactPayload } from '../lib/api';

const subjects = ['Course Inquiry', 'Placement Services', 'Tech Services', 'Partnership', 'Other'];
const experienceOptions = ['Fresher', '1 - 2 years', '3 - 5 years', '6 - 8 years', '9+ years'];
const whatsappNumber = '917385490573';

const initialValues: ContactPayload = {
  name: '',
  email: '',
  phone: '',
  jobRole: '',
  designation: '',
  experience: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors: Partial<Record<keyof ContactPayload, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email required';
    if (!form.jobRole.trim()) nextErrors.jobRole = 'Required';
    if (!form.experience.trim()) nextErrors.experience = 'Required';
    if (!form.subject) nextErrors.subject = 'Pick a subject';
    if (!form.message.trim()) nextErrors.message = 'Required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function getWhatsappLink(payload: ContactPayload) {
    const message = [
      'Hello DigitBuild, I would like to connect through the Contact Us form.',
      '',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone || 'Not provided'}`,
      `Job Role: ${payload.jobRole || 'Not provided'}`,
      `Designation: ${payload.designation || 'Not provided'}`,
      `Experience: ${payload.experience || 'Not provided'}`,
      `Subject: ${payload.subject}`,
      `Message: ${payload.message}`,
    ].join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    window.open(getWhatsappLink(form), '_blank', 'noopener,noreferrer');
    showToast('Sent to WhatsApp', 'Your message is ready to send on WhatsApp.');
    setForm(initialValues);
    setErrors({});
    setLoading(false);
  }

  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-contact">
        <div className="container-custom">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Contact Us</SectionEyebrow>
            <h1 className="page-hero-title">
              Let's <span className="page-hero-muted">talk</span>
            </h1>
            <p className="page-hero-copy">Reach out for courses, placement support, partnerships, or product services.</p>
          </Reveal>

          <div className="contact-grid">
            <Reveal>
              <div className="contact-details">
                <SectionTitle className="mb-3">Contact details</SectionTitle>
                {[
                  { icon: MapPin, label: 'Address', value: 'Pune, Maharashtra, India' },
                  { icon: Phone, label: 'Phone', value: '73854 90573' },
                  { icon: Mail, label: 'Email', value: 'marutidigitbuild@gmail.com' },
                ].map((item) => (
                  <div key={item.label} className="contact-item">
                    <item.icon className="contact-item-icon" />
                    <div>
                      <h4>{item.label}</h4>
                      <p>{item.value}</p>
                    </div>
                  </div>
                ))}

                <div className="map-wrap">
                  <iframe
                    title="Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.68077838045!2d73.72288354!3d18.524564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <form onSubmit={handleSubmit} className="contact-form">
                <SectionTitle className="mb-3">Send us a message</SectionTitle>
                <div>
                  <input className="field" type="text" placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                  {errors.name ? <p className="field-error">{errors.name}</p> : null}
                </div>
                <div>
                  <input className="field" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
                  {errors.email ? <p className="field-error">{errors.email}</p> : null}
                </div>
                <input className="field" type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
                <div className="contact-form-row">
                  <div>
                    <input className="field" type="text" placeholder="Job Role" value={form.jobRole} onChange={(event) => setForm((current) => ({ ...current, jobRole: event.target.value }))} />
                    {errors.jobRole ? <p className="field-error">{errors.jobRole}</p> : null}
                  </div>
                  <div>
                    <select className="field" value={form.experience} onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))}>
                      <option value="">Experience</option>
                      {experienceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.experience ? <p className="field-error">{errors.experience}</p> : null}
                  </div>
                </div>
                <div>
                  <input className="field" type="text" placeholder="Designation (optional)" value={form.designation} onChange={(event) => setForm((current) => ({ ...current, designation: event.target.value }))} />
                  {errors.designation ? <p className="field-error">{errors.designation}</p> : null}
                </div>
                <div>
                  <select className="field" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}>
                    <option value="">Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subject ? <p className="field-error">{errors.subject}</p> : null}
                </div>
                <div>
                  <textarea className="field field-textarea" placeholder="Message" rows={4} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
                  {errors.message ? <p className="field-error">{errors.message}</p> : null}
                </div>
                <Button type="submit" block disabled={loading}>
                  {loading ? 'Opening WhatsApp...' : 'Send on WhatsApp'}
                </Button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
