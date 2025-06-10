// src/components/Testimonials.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Testimonials.css';

const reviews = [
  { name: 'Alice', text: 'Fleetly changed how we manage logistics.' },
  { name: 'Bob', text: 'Real-time tracking saved us hours each day.' },
  { name: 'Carol', text: 'Insightful analytics improved routes.' }
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
