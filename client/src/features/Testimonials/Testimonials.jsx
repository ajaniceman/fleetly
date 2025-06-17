import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Import Swiper modules
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // Styles for navigation arrows
import 'swiper/css/pagination'; // Styles for pagination dots

import './Testimonials.css';

// Using translation keys now
const reviews = [
  {
    quoteKey: "testimonial_sarah_quote",
    nameKey: "testimonial_sarah_name",
    roleKey: "testimonial_sarah_role",
    avatar: "https://placehold.co/150x150/dbeafe/1e40af?text=SK", // Placeholder with initials
  },
  {
    quoteKey: "testimonial_mike_quote",
    nameKey: "testimonial_mike_name",
    roleKey: "testimonial_mike_role",
    avatar: "https://placehold.co/150x150/dcfce7/14532d?text=MT", // Placeholder with initials
  },
  {
    quoteKey: "testimonial_david_quote",
    nameKey: "testimonial_david_name",
    roleKey: "testimonial_david_role",
    avatar: "https://placehold.co/150x150/ffe4e6/881337?text=DR", // Placeholder with initials
  },
  {
    quoteKey: "testimonial_lisa_quote",
    nameKey: "testimonial_lisa_name",
    roleKey: "testimonial_lisa_role",
    avatar: "https://placehold.co/150x150/fef2f2/7f1d1d?text=LM", // Placeholder with initials
  },
  {
    quoteKey: "testimonial_chris_quote",
    nameKey: "testimonial_chris_name",
    roleKey: "testimonial_chris_role",
    avatar: "https://placehold.co/150x150/e0f2fe/075985?text=CP", // Placeholder with initials
  }
];

export default function Testimonials() {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className="testimonials-section-content"> {/* Use a div for section content */}
      <div className="testimonials-wrapper">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]} // Enable modules
          spaceBetween={30}
          slidesPerView={1}
          loop={true} // Keep loop for continuous sliding
          grabCursor={true}
          navigation={true} // Enable navigation arrows
          pagination={{ clickable: true }} // Enable clickable pagination dots
          autoplay={{
            delay: 5000, // 5 seconds delay
            disableOnInteraction: false, // Continue autoplay after user interaction
          }}
          breakpoints={{
            768: {
              slidesPerView: 2, // Show 2 slides on screens >= 768px
            },
            1024: {
              slidesPerView: 3, // Show 3 slides on screens >= 1024px
            },
          }}
          className="testimonials-swiper"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <div className="quote-icon">❝</div> {/* Decorative quote icon */}
                <blockquote className="quote">"{t(review.quoteKey)}"</blockquote> {/* Use translation for quote */}
                <div className="author-details">
                  <div className="avatar-container">
                    <img
                      src={review.avatar}
                      alt={`Avatar of ${t(review.nameKey)}`} // Translate alt text
                      className="avatar"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "https://placehold.co/150x150/cccccc/000000?text=User"; // Fallback placeholder
                      }}
                    />
                  </div>
                  <div className="author-info">
                    <p className="name">{t(review.nameKey)}</p> {/* Use translation for name */}
                    <p className="role">{t(review.roleKey)}</p> {/* Use translation for role */}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
