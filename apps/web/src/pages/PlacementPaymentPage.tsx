import { ArrowLeft, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/toast/ToastProvider';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { getCareerPackageBySlug, type CareerPackage } from '../lib/payment';
import { API_BASE } from '../config/api';
import { useSanityData } from '../lib/useSanityData';

type PaymentForm = {
  name: string;
  email: string;
  phone: string;
  jobRole: string;
  experience: string;
};

function formatPriceFromAmount(amountInPaise: number) {
  return `Rs ${Math.round(amountInPaise / 100)}`;
}

const initialValues: PaymentForm = {
  name: '',
  email: '',
  phone: '',
  jobRole: '',
  experience: '',
};

function getExperienceOptions(experienceLabel = '') {
  const rangeMatch = experienceLabel.match(/(\d+)\s*to\s*(\d+)/i);
  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    if (Number.isFinite(start) && Number.isFinite(end) && start <= end) {
      return Array.from({ length: end - start + 1 }, (_, index) => String(start + index));
    }
  }

  const plusMatch = experienceLabel.match(/(\d+)\s*\+/);
  if (plusMatch) {
    return [`${plusMatch[1]}+`];
  }

  if (/all experience/i.test(experienceLabel)) {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  }

  return [];
}

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      notes?: Record<string, string>;
      theme?: {
        color: string;
      };
      handler?: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => void | Promise<void>;
      modal?: {
        ondismiss?: () => void;
      };
    }) => {
      open: () => void;
    };
  }
}

async function loadRazorpayScript() {
  if (window.Razorpay) return true;

  return await new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function parseApiResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {
      message: text || 'Unexpected non-JSON response from server.',
    };
  }
}

export default function PlacementPaymentPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const packageSlug = searchParams.get('package');
  const { data: sanityPackages, loading: packagesLoading } = useSanityData<CareerPackage[]>(`*[_type == "placementPackage"] | order(amount asc)`);
  const selectedPackage = useMemo(() => {
    const dynamicPackage = sanityPackages?.find((pkg) => pkg.slug === packageSlug);
    return dynamicPackage || getCareerPackageBySlug(packageSlug);
  }, [packageSlug, sanityPackages]);
  const experienceOptions = useMemo(() => getExperienceOptions(selectedPackage?.experience), [selectedPackage]);
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const isFormReady =
    form.name.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.phone.trim() &&
    form.jobRole.trim() &&
    form.experience.trim();

  useEffect(() => {
    setForm((current) => {
      if (!current.experience || experienceOptions.includes(current.experience)) return current;
      return { ...current, experience: '' };
    });
  }, [experienceOptions]);

  if (!selectedPackage && packagesLoading) {
    return <main className="pt-nav"><div className="page-skeleton" /></main>;
  }

  if (!selectedPackage) {
    return <Navigate to="/" replace />;
  }

  const packageDetails = selectedPackage;

  function validate() {
    const nextErrors: Partial<Record<keyof PaymentForm, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email required';
    if (!form.phone.trim()) nextErrors.phone = 'Required';
    if (!form.jobRole.trim()) nextErrors.jobRole = 'Required';
    if (!form.experience.trim()) nextErrors.experience = 'Required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay checkout.');
      }

      const createOrderResponse = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageSlug: packageDetails.slug,
          customer: form,
        }),
      });

      const orderData = await parseApiResponse(createOrderResponse);

      if (!createOrderResponse.ok) {
        throw new Error(typeof orderData.message === 'string' ? orderData.message : 'Unable to create Razorpay order.');
      }

      const checkout = new window.Razorpay({
        key: String(orderData.keyId),
        amount: Number(orderData.amount),
        currency: String(orderData.currency),
        name: 'DigitBuild',
        description: packageDetails.name,
        order_id: String(orderData.orderId),
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          packageSlug: packageDetails.slug,
          packageName: packageDetails.name,
          jobRole: form.jobRole,
          experience: form.experience,
        },
        theme: {
          color: '#4f6ef7',
        },
        handler: async (response) => {
          const verifyResponse = await fetch(`${API_BASE}/api/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              packageSlug: packageDetails.slug,
              ...response,
            }),
          });

          const verifyData = await parseApiResponse(verifyResponse);

          if (!verifyResponse.ok || !verifyData.success) {
            showToast('Verification failed', typeof verifyData.message === 'string' ? verifyData.message : 'Payment was received but could not be verified.');
            setLoading(false);
            return;
          }

          showToast('Payment successful', `${packageDetails.name} payment was verified successfully.`);
          navigate('/');
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      checkout.open();
    } catch (error) {
      showToast('Payment setup failed', error instanceof Error ? error.message : 'Unable to start Razorpay checkout.');
      setLoading(false);
    }
  }

  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-placement">
        <div className="container-custom">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Payment Details</SectionEyebrow>
            <SectionTitle as="h1" className="mb-3">
              Complete your <span className="hero-title-muted">package details</span>
            </SectionTitle>
            <p className="page-hero-copy">
              Review the selected placement package, share your basic details, and continue to Razorpay to complete the payment.
            </p>
          </Reveal>

          <div className="payment-page-grid">
            <Reveal>
              <div className="payment-summary-card">
                <div className="payment-summary-top">
                  <div className="payment-summary-icon">
                    <CreditCard />
                  </div>
                  <div>
                    <p className="course-detail-label">Selected Package</p>
                    <h2 className="payment-summary-title">{selectedPackage.name}</h2>
                    <p className="payment-summary-copy">{selectedPackage.experience}</p>
                  </div>
                </div>

                <div className="payment-amount-card">
                  <span>Amount payable</span>
                  <strong>{formatPriceFromAmount(selectedPackage.amount)}</strong>
                </div>

                <div className="course-detail-block">
                  <p className="course-detail-label">Includes</p>
                  <ul className="course-detail-list">
                    {selectedPackage.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="payment-security-note">
                  <ShieldCheck className="payment-security-icon" />
                  You will be redirected to Razorpay on the next step to complete the payment securely.
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <form onSubmit={handleContinue} className="payment-form-card">
                <SectionTitle className="mb-3">Basic details</SectionTitle>
                <div>
                  <label className="form-field-label" htmlFor="payment-name">
                    Full name <span className="required-mark">*</span>
                  </label>
                  <input id="payment-name" className="field" type="text" placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                  {errors.name ? <p className="field-error">{errors.name}</p> : null}
                </div>
                <div>
                  <label className="form-field-label" htmlFor="payment-email">
                    Email address <span className="required-mark">*</span>
                  </label>
                  <input id="payment-email" className="field" type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
                  {errors.email ? <p className="field-error">{errors.email}</p> : null}
                </div>
                <div>
                  <label className="form-field-label" htmlFor="payment-phone">
                    Phone number <span className="required-mark">*</span>
                  </label>
                  <input id="payment-phone" className="field" type="tel" placeholder="Phone number" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
                  {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
                </div>
                <div>
                  <label className="form-field-label" htmlFor="payment-job-role">
                    Current job role <span className="required-mark">*</span>
                  </label>
                  <input id="payment-job-role" className="field" type="text" placeholder="Current job role" value={form.jobRole} onChange={(event) => setForm((current) => ({ ...current, jobRole: event.target.value }))} />
                  {errors.jobRole ? <p className="field-error">{errors.jobRole}</p> : null}
                </div>
                <div>
                  <label className="form-field-label" htmlFor="payment-experience">
                    Experience <span className="required-mark">*</span>
                  </label>
                  <select id="payment-experience" className="field" value={form.experience} onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))}>
                    <option value="">Select {selectedPackage.experience}</option>
                    {experienceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.experience ? <p className="field-error">{errors.experience}</p> : null}
                </div>

                <div className="payment-form-actions">
                  <Link to="/" className="btn btn-pill-outline btn-sm">
                    <ArrowLeft className="btn-icon" />
                    Back
                  </Link>
                  <Button type="submit" size="sm" disabled={loading || !isFormReady} aria-disabled={loading || !isFormReady}>
                    {loading ? 'Opening Razorpay...' : 'Continue'}
                    <ArrowRight className="btn-icon" />
                  </Button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
