"use client";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { heroCarouselSlides } from "../data/content";
import "./HeroCarousel.css";

function MyfxbookMark() {
  return (
    <span className="hero-carousel__fx" aria-hidden="true">
      <img
        src="/images/myfxbook-mark.png"
        alt=""
        width={18}
        height={18}
        className="hero-carousel__fx-img"
      />
    </span>
  );
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const total = heroCarouselSlides.length;

  const goTo = useCallback((i) => {
    setIndex(((i % total) + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || lightboxImg) return;
    const id = setInterval(() => goTo(index + 1), 5200);
    return () => clearInterval(id);
  }, [index, paused, lightboxImg, goTo]);

  useEffect(() => {
    if (lightboxImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsZoomed(false); // Reset zoom when closed
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxImg]);

  const slide = heroCarouselSlides[index];

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-carousel__card">
        <div className="hero-carousel__header">
          <MyfxbookMark />
          <span>Verified by Myfxbook</span>
        </div>

        <div className="hero-carousel__frame">
          {heroCarouselSlides.map((s, i) => (
            <img
              key={s.image}
              src={s.image}
              alt={s.alt || s.title}
              title={s.titleAttr || s.alt || s.title}
              className={`hero-carousel__img ${i === index ? "is-active" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              onClick={() => setLightboxImg(s.image)}
            />
          ))}

          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--prev"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--next"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="hero-carousel__dots">
            {heroCarouselSlides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                className={`hero-carousel__dot ${i === index ? "is-active" : ""}`}
                aria-label={`Show ${s.title}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero-carousel__footer" key={slide.title}>
        <p className="hero-carousel__caption">{slide.title}</p>
        {slide.cta && (
          <a href={slide.cta.href} className="hero-carousel__cta">
            {slide.cta.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>

      {lightboxImg && (() => {
        const currentIdx = heroCarouselSlides.findIndex(s => s.image === lightboxImg);
        const goNext = (e) => {
          e.stopPropagation();
          setLightboxImg(heroCarouselSlides[(currentIdx + 1) % total].image);
          setIsZoomed(false);
        };
        const goPrev = (e) => {
          e.stopPropagation();
          setLightboxImg(heroCarouselSlides[(currentIdx - 1 + total) % total].image);
          setIsZoomed(false);
        };
        
        const closeLightbox = () => {
          setLightboxImg(null);
        };
        
        const toggleZoom = (e) => {
          e.stopPropagation();
          setIsZoomed(!isZoomed);
        };
        
        const lightboxNode = (
          <div className={`hero-lightbox ${isZoomed ? 'is-zoomed-view' : ''}`} onClick={closeLightbox}>
            <div className="hero-lightbox__toolbar" onClick={e => e.stopPropagation()}>
              <button type="button" className="hero-lightbox__tool-btn" onClick={toggleZoom} aria-label="Toggle Zoom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isZoomed ? <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM8 11h6"/> : <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM11 8v6m-3-3h6"/>}
                </svg>
              </button>
              <button type="button" className="hero-lightbox__tool-btn" onClick={goPrev} aria-label="Previous image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="hero-lightbox__tool-btn" onClick={goNext} aria-label="Next image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="hero-lightbox__tool-btn" onClick={closeLightbox} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="hero-lightbox__img-container">
              <img
                src={lightboxImg}
                alt="Enlarged view"
                className={`hero-lightbox__img ${isZoomed ? 'is-zoomed' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleZoom(e); }}
                title="Click to toggle zoom"
              />
            </div>
          </div>
        );
        return typeof document !== "undefined" ? createPortal(lightboxNode, document.body) : null;
      })()}
    </div>
  );
}
