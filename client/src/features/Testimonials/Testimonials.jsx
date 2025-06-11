import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Testimonials.css';

const reviews = [
  {
    quote: "Fleetly reminded me to renew my registration—saved me a $200 late fee!",
    name: "Sarah K.",
    role: "Small Business Owner",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote: "I used to forget oil changes. Now my truck runs smoother than ever.",
    name: "Mike T.",
    role: "Independent Driver",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    quote: "Tracking my fleet's maintenance has never been easier. Fleetly pays for itself in avoided repair costs.",
    name: "David R.",
    role: "Fleet Manager",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    quote: "The registration reminders alone are worth it. No more last-minute DMV runs!",
    name: "Lisa M.",
    role: "Rideshare Driver",
    avatar: "https://i.pravatar.cc/150?img=9",
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-wrapper">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop
            grabCursor
            className="testimonials-swiper"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-card">
                  <div className="avatar-container">
                    <img 
                      src={review.avatar} 
                      alt={review.name} 
                      className="avatar"
                    />
                  </div>
                  <blockquote className="quote">"{review.quote}"</blockquote>
                  <div className="author-info">
                    <p className="name">{review.name}</p>
                    <p className="role">{review.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}