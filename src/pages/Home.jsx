import { Link } from 'react-router-dom'

const skinConcerns = [
  {
    label: 'Severe acne & breakouts',
    concern: 'acne',
    description: 'Clarifying care to help reduce congestion, calm blemishes, and support clearer-looking skin.',
    image: '/skin-conditions/severe-acne.jpg',
    alt: 'Skincare treatment for acne-prone skin',
  },
  {
    label: 'Dark eye circles',
    concern: 'under-eyes',
    description: 'Cooling, gentle treatments to brighten the under-eye area and soften puffiness and fine lines.',
    image: '/skin-conditions/dark-eye-circles.jpg',
    alt: 'Gentle skincare treatment around the eyes',
  },
  {
    label: 'Aging & fine lines',
    concern: 'aging',
    description: 'Restorative formulas to smooth visible fine lines, support firmness, and replenish dry skin.',
    image: '/skin-conditions/aging-fine-lines.jpg',
    alt: 'Skincare routine for visible signs of aging',
  },
]

function Home() {
  return (
    <main className="olveraa-home">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Skin care for real routines</p>
          <h1 id="hero-title">Clearer. Brighter.<br />Carefully renewed.</h1>
          <p className="hero-description">
            Skincare for acne, tired-looking eyes, fine lines, and whatever your skin is dealing with today.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="button button-dark">Explore skincare <span aria-hidden="true">↗</span></Link>
            <a href="#about" className="text-link">Get to know us</a>
          </div>
          <p className="hero-note">A gentler way to care for your skin.</p>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1400&q=85"
            alt="Woman receiving a facial treatment"
          />
          <span className="image-caption">Your skin. Your pace. Your care.</span>
        </div>
      </section>

      <section className="concerns-section" aria-labelledby="concerns-title">
        <div className="section-heading">
          <p className="eyebrow">What you may need</p>
          <h2 id="concerns-title">Care for skin<br />as it is today.</h2>
        </div>
        <div className="concern-list">
          {skinConcerns.map((skinConcern, index) => (
            <Link
              to={`/products?search=${encodeURIComponent(skinConcern.concern)}`}
              className="concern-item"
              key={skinConcern.concern}
            >
              <img className="concern-image" src={skinConcern.image} alt={skinConcern.alt} loading="lazy" />
              <span className="concern-number">0{index + 1}</span>
              <span className="concern-copy">
                <span className="concern-label">{skinConcern.label}</span>
                <span className="concern-description">{skinConcern.description}</span>
              </span>
              <span className="concern-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-mark" aria-hidden="true">O.</div>
        <div className="about-copy">
          <p className="eyebrow">A little about Olvera</p>
          <h2 id="about-title">Good skin care<br />starts with listening.</h2>
          <p>
            Olvera is skincare for real skin and everyday routines. We think care should feel uncomplicated
            and kind to the person looking back in the mirror.
          </p>
          <p>
            From the first cleanse to the last step of your evening, we make room for a little more patience
            and a lot more self-understanding.
          </p>
          <Link to="/products" className="text-link">Find your everyday care <span aria-hidden="true">→</span></Link>
        </div>
        <div className="about-aside">
          <span className="aside-rule" />
          <p>Care is not about changing who you are.<br />It is about showing up for yourself.</p>
          <span className="aside-signature">The Olvera approach</span>
        </div>
      </section>

      <footer className="home-footer">
        <Link to="/" className="brand-wordmark" aria-label="Olvera home"><img src="/olvera-logo.svg" alt="Olvera" /></Link>
        <p>Take care, gently.</p>
        <Link to="/products" className="text-link">Explore the collection <span aria-hidden="true">↗</span></Link>
      </footer>
    </main>
  )
}

export default Home