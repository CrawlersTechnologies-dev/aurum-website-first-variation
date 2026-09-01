"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./ThankYouPage.css";

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 12l3.5 3.5L17 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const token = searchParams.get("token") || "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedPlan: "",
    platform: "",
    accountNumber: "",
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.selectedPlan || !form.platform || !form.accountNumber) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sessionId, token }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="ty-submitted">
        <div className="ty-submitted__icon">
          <CheckIcon />
        </div>
        <h2>Requirements Submitted!</h2>
        <p>
          Thank you! Your requirements have been submitted successfully. Our team will
          review the information and get back to you shortly.
        </p>
        <p>A confirmation email has been sent to <strong>{form.email}</strong>.</p>
        <Link href="/" className="btn btn--gold ty-submitted__cta">Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      {/* Success Banner */}
      <div className="ty-banner">
        <div className="ty-banner__icon">
          <CheckIcon />
        </div>
        <div className="ty-banner__text">
          <h1>Thank you for your successful payment!</h1>
          <p>Your payment has been successfully completed. Thank you for choosing us.</p>
        </div>
      </div>

      {/* Requirements Form Intro */}
      <div className="ty-form-intro">
        <p className="ty-form-intro__lead">
          Please complete the requirements form below so our team can better
          understand your needs and proceed with your request.
        </p>
        <div className="ty-form-intro__note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            Don&apos;t have time to complete the form right now? No problem. A secure link
            to this form has also been sent to your email, so you can complete it later at
            your convenience.
          </span>
        </div>
      </div>

      {/* Requirements Form */}
      <form className="ty-form" onSubmit={handleSubmit} noValidate>
        <div className="ty-form__section">
          <h3 className="ty-form__section-title">Personal Information</h3>
          <div className="ty-form__row ty-form__row--2col">
            <label className="ty-form__label">
              Full Name <span className="ty-form__required">*</span>
              <input
                type="text"
                name="fullName"
                className="ty-form__input"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </label>
            <label className="ty-form__label">
              Email Address <span className="ty-form__required">*</span>
              <input
                type="email"
                name="email"
                className="ty-form__input"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
              />
            </label>
          </div>
          <div className="ty-form__row ty-form__row--2col">
            <label className="ty-form__label">
              Phone Number
              <input
                type="tel"
                name="phone"
                className="ty-form__input"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
              />
            </label>
          </div>
        </div>

        <div className="ty-form__section">
          <h3 className="ty-form__section-title">Order Information</h3>
          <div className="ty-form__row ty-form__row--2col">
            <label className="ty-form__label">
              Selected Plan <span className="ty-form__required">*</span>
              <select
                name="selectedPlan"
                className="ty-form__input ty-form__select"
                value={form.selectedPlan}
                onChange={handleChange}
                required
              >
                <option value="">Select plan...</option>
                <option value="Silver">Silver Plan</option>
                <option value="Gold">Gold Plan</option>
                <option value="Diamond">Diamond Plan</option>
              </select>
            </label>
            <label className="ty-form__label">
              Platform (MT4 / MT5) <span className="ty-form__required">*</span>
              <select
                name="platform"
                className="ty-form__input ty-form__select"
                value={form.platform}
                onChange={handleChange}
                required
              >
                <option value="">Select platform...</option>
                <option value="MT4">MetaTrader 4 (MT4)</option>
                <option value="MT5">MetaTrader 5 (MT5)</option>
              </select>
            </label>
          </div>
          <div className="ty-form__row ty-form__row--2col">
            <label className="ty-form__label">
              Account Number <span className="ty-form__required">*</span>
              <input
                type="text"
                name="accountNumber"
                className="ty-form__input"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder="Trading account number"
                required
              />
            </label>
          </div>
          
          {sessionId && (
            <div className="ty-form__ref-note" style={{ marginTop: '1rem' }}>
              <span>Payment Reference:</span>
              <code>{sessionId.slice(0, 32)}...</code>
            </div>
          )}
        </div>

        {error && (
          <div className="ty-form__error" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn--gold ty-form__submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit My Requirements"}
        </button>
      </form>
    </>
  );
}

export default function ThankYouClient() {
  return (
    <Suspense fallback={<div className="ty-loading">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
