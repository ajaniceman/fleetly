import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Import Swiper modules

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // Styles for navigation arrows
import 'swiper/css/pagination'; // Styles for pagination dots

import './Testimonials.css';

const reviews = [
  {
    quote: "Fleetly reminded me to renew my registration—saved me a $200 late fee! It's an indispensable tool for staying compliant.",
    name: "Sarah K.",
    role: "Small Business Owner",
    avatar: "https://placehold.co/150x150/dbeafe/1e40af?text=SK", // Placeholder with initials
  },
  {
    quote: "I used to forget oil changes and other essential maintenance. Now my truck runs smoother than ever, and I've seen a noticeable reduction in unexpected breakdowns. Fleetly is a game-changer.",
    name: "Mike T.",
    role: "Independent Driver",
    avatar: "https://placehold.co/150x150/dcfce7/14532d?text=MT", // Placeholder with initials
  },
  {
    quote: "Tracking my fleet's maintenance has never been easier. From services to registration dates, Fleetly keeps everything organized. It truly pays for itself in avoided repair costs and peace of mind.",
    name: "David R.",
    role: "Fleet Manager",
    avatar: "https://placehold.co/150x150/ffe4e6/881337?text=DR", // Placeholder with initials
  },
  {
    quote: "The registration reminders alone are worth it. No more last-minute DMV runs or scrambling for documents. This app keeps me perfectly on schedule.",
    name: "Lisa M.",
    role: "Rideshare Driver",
    avatar: "https://placehold.co/150x150/fef2f2/7f1d1d?text=LM", // Placeholder with initials
  },
  {
    quote: "Implementing Fleetly streamlined our operations significantly. The ability to track specific engine hours for our heavy machinery has been invaluable for preventive maintenance.",
    name: "Chris P.",
    role: "Construction Lead",
    avatar: "https://placehold.co/150x150/e0f2fe/075985?text=CP", // Placeholder with initials
  }
];

export default function Testimonials() {
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
                <blockquote className="quote">"{review.quote}"</blockquote>
                <div className="author-details">
                  <div className="avatar-container">
                    <img
                      src={review.avatar}
                      alt={`Avatar of ${review.name}`}
                      className="avatar"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "https://placehold.co/150x150/cccccc/000000?text=User"; // Fallback placeholder
                      }}
                    />
                  </div>
                  <div className="author-info">
                    <p className="name">{review.name}</p>
                    <p className="role">{review.role}</p>
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
