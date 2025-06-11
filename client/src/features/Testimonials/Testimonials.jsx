// src/components/Testimonials.jsx
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
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <h2>What Our Users Say</h2>
      <Swiper spaceBetween={20} slidesPerView={1} loop>
        {reviews.map((r, i) => (
          <SwiperSlide key={i}>
            <div className="card">
              <p>"{r.text}"</p>
              <div className="author">— {r.name}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
