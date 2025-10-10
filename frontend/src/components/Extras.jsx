import React from "react";

export function Testimonials() {
  const items = [
    { name: "Client A", text: "Great work!" },
    { name: "Client B", text: "Fast and professional." }
  ];
  return (
    <div id="testimonials" className="my-5">
      <h4>Testimonials</h4>
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-inner">
          {items.map((it, idx) => (
            <div className={`carousel-item ${idx===0?'active':''}`} key={idx}>
              <div className="d-flex justify-content-center p-4">
                <div className="card w-75"><div className="card-body"><p>{it.text}</p><small>- {it.name}</small></div></div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}

export function Timeline() {
  const events = [
    { time: "2024", title: "Started freelancing", desc: "Built first client project" },
    { time: "2025", title: "Launched portfolio", desc: "Better UI and blog" }
  ];
  return (
    <div>
      <h4>Experience</h4>
      <ul className="timeline list-unstyled">
        {events.map((e, i) => (
          <li key={i} className="mb-3">
            <h6>{e.time} - {e.title}</h6>
            <p>{e.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
