import { CreditCard, Loader2, ReceiptText, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { API_BASE } from '../config/api';

type AdminPayment = {
  id: string;
  orderId: string;
  paymentId?: string;
  status: 'paid' | 'pending';
  packageSlug: string;
  packageName: string;
  amount: number | null;
  currency: 'INR';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  jobRole: string;
  experience: string;
  initiatedAt?: string;
  paidAt?: string;
  updatedAt?: string;
  events: Array<{
    id: string;
    type: 'purchase_initiated' | 'payment_success';
    createdAt?: string;
  }>;
};

function formatAmount(amount: number | null) {
  if (typeof amount !== 'number') return 'Not captured';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

function formatDate(value?: string) {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="payment-detail-item">
      <span>{label}</span>
      <strong>{value || 'Not available'}</strong>
    </div>
  );
}

export default function AdminPaymentsPage() {
  const isAdmin = localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userRole') === 'admin';
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    let active = true;

    async function fetchPayments() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/admin-payments`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Unable to load payments.');
        }

        if (active) {
          setPayments(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load payments.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchPayments();

    return () => {
      active = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedPayment && !dialog.open) {
      dialog.showModal();
    }
  }, [selectedPayment]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  function closeDetails() {
    dialogRef.current?.close();
    setSelectedPayment(null);
  }

  return (
    <main className="pt-nav">
      <section className="section-padding admin-payments-section">
        <div className="container-custom">
          <Reveal className="admin-payments-header">
            <div>
              <SectionEyebrow>Admin</SectionEyebrow>
              <SectionTitle as="h1">Payment tracking</SectionTitle>
              <p className="admin-payments-copy">Review Razorpay checkout activity and verified payments from one place.</p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="admin-payments-panel">
              <div className="admin-payments-panel-top">
                <div className="admin-payments-title">
                  <CreditCard size={18} />
                  <span>Payments</span>
                </div>
                <span className="admin-payments-count">{payments.length} total</span>
              </div>

              {loading ? (
                <div className="admin-payments-state">
                  <Loader2 className="admin-payments-spinner" size={22} />
                  Loading payments...
                </div>
              ) : error ? (
                <div className="admin-payments-state admin-payments-error">{error}</div>
              ) : payments.length === 0 ? (
                <div className="admin-payments-state">No payments tracked yet.</div>
              ) : (
                <div className="admin-payments-table-wrap">
                  <table className="admin-payments-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Package</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} onClick={() => setSelectedPayment(payment)}>
                          <td>
                            <button type="button" className="payment-row-button">
                              <span>{payment.customerName}</span>
                              <small>{payment.customerEmail}</small>
                            </button>
                          </td>
                          <td>{payment.packageName}</td>
                          <td>{formatAmount(payment.amount)}</td>
                          <td>
                            <span className={`payment-status-badge payment-status-${payment.status}`}>
                              {payment.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td>{formatDate(payment.paidAt || payment.updatedAt || payment.initiatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="course-modal payment-detail-modal"
        onClose={() => setSelectedPayment(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDetails();
        }}
      >
        {selectedPayment ? (
          <div className="course-modal-panel payment-detail-panel">
            <div className="payment-detail-header">
              <div>
                <p className="course-modal-kicker">Payment details</p>
                <h2 className="payment-detail-title">{selectedPayment.customerName}</h2>
              </div>
              <button type="button" className="course-modal-close" onClick={closeDetails} aria-label="Close payment details">
                <X />
              </button>
            </div>

            <div className="payment-detail-summary">
              <ReceiptText size={20} />
              <div>
                <span>{selectedPayment.packageName}</span>
                <strong>{formatAmount(selectedPayment.amount)}</strong>
              </div>
              <span className={`payment-status-badge payment-status-${selectedPayment.status}`}>
                {selectedPayment.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>

            <div className="payment-detail-grid">
              <DetailItem label="Email" value={selectedPayment.customerEmail} />
              <DetailItem label="Phone" value={selectedPayment.customerPhone} />
              <DetailItem label="Job role" value={selectedPayment.jobRole} />
              <DetailItem label="Experience" value={selectedPayment.experience} />
              <DetailItem label="Order ID" value={selectedPayment.orderId} />
              <DetailItem label="Payment ID" value={selectedPayment.paymentId} />
              <DetailItem label="Package slug" value={selectedPayment.packageSlug} />
              <DetailItem label="Initiated at" value={formatDate(selectedPayment.initiatedAt)} />
              <DetailItem label="Paid at" value={formatDate(selectedPayment.paidAt)} />
            </div>
          </div>
        ) : null}
      </dialog>
    </main>
  );
}
