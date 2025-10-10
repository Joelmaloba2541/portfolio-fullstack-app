import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  useEffect(() => {
    // Add fade-in animation class after component mounts
    const hero = document.querySelector('.hero-content');
    if (hero) {
      hero.classList.add('animate-fade-in');
    }
  }, []);

  return (
    <section className="hero py-5">
      <div className="container">
        <div className="row justify-content-center text-center py-5">
          <div className="col-12 col-md-10 col-lg-8 hero-content">
            <h1 className="display-4 fw-bold mb-2">
              👋 Hi, I'm Wanjala Joel Maloba Wangila
            </h1>
            <h2 className="h3 mb-4">💻 Full-Stack Developer</h2>
            
            <p className="lead mb-4">
              Building scalable digital solutions that merge creativity with clean code.
            </p>
            
            <p className="mb-5">
              I'm a passionate and detail-oriented Full-Stack Developer with experience designing, 
              developing, and deploying modern web applications. I love transforming ideas into 
              practical, elegant solutions using tools like Django, React, Node.js, and Flask. 
              Whether it's a dynamic frontend or a robust backend, I'm dedicated to writing 
              efficient, maintainable, and high-performing code.
            </p>

            <div className="d-flex justify-content-center gap-3">
              <Link to="/contact" className="btn btn-primary btn-lg">
                🚀 Let's build something amazing together
              </Link>
              <Link to="/projects" className="btn btn-outline-primary btn-lg">
                View My Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
