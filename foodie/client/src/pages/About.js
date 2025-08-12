import React, { useState } from 'react';
import './About.css';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Simulate form submission (in a real app, this would send to backend)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="about">
      <div className="container">
        <div className="about-content">
          <h1>About Foodie</h1>
          
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              Foodie is a comprehensive full-stack web application designed to promote healthy eating 
              through community content, smart search, and integrated health features. We believe that 
              everyone deserves access to delicious, nutritious recipes and important food safety information.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🍽️ Recipe Sharing</h3>
                <p>Share your favorite recipes with the community, complete with ingredients, instructions, and cooking tips.</p>
              </div>
              <div className="feature-card">
                <h3>🔍 Smart Search</h3>
                <p>Find recipes by keyword, cuisine type, or difficulty level with our advanced search and filter system.</p>
              </div>
              <div className="feature-card">
                <h3>❤️ Community Features</h3>
                <p>Like recipes, add reviews and ratings, and interact with other food enthusiasts.</p>
              </div>
              <div className="feature-card">
                <h3>🍎 Health & Safety</h3>
                <p>Access real-time food safety recalls from the FDA and nutrition benchmarks from NHANES.</p>
              </div>
            </div>
          </section>

          {/* Contact Us Section */}
          <section className="about-section">
            <h2>Contact Us</h2>
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Get in Touch</h3>
                <p>
                  Have questions, suggestions, or feedback? We'd love to hear from you! 
                  Fill out the form and we'll get back to you as soon as possible.
                </p>
                
                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="contact-icon">📧</div>
                    <div>
                      <h4>Email</h4>
                      <p>team@foodie.com</p>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="contact-icon">🏫</div>
                    <div>
                      <h4>University</h4>
                      <p>Columbia University</p>
                      <p>APAN 5490 Course</p>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="contact-icon">👥</div>
                    <div>
                      <h4>Team</h4>
                      <p>Cungang Zhang</p>
                      <p>Xuanshuo Liu</p>
                      <p>Liao Fang</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Tell us more..."
                    ></textarea>
                  </div>
                  
                  {error && <div className="error-message">{error}</div>}
                  {success && (
                    <div className="success-message">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="about-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>How do I create an account?</h3>
                <p>Click the "Login" button in the navigation bar and then use the registration link on the login page to create your account.</p>
              </div>
              
              <div className="faq-item">
                <h3>How can I share a recipe?</h3>
                <p>After logging in, click "Share Recipe" in the navigation bar and fill out the recipe form with ingredients, instructions, and other details.</p>
              </div>
              
              <div className="faq-item">
                <h3>How do I search for recipes?</h3>
                <p>Use the search bar on the home page to search by keywords, or use the filters to search by cuisine type or difficulty level.</p>
              </div>
              
              <div className="faq-item">
                <h3>What is the Food Safety feature?</h3>
                <p>The Food Safety section shows real-time food recall information from the FDA, helping you stay informed about food safety issues.</p>
              </div>
              
              <div className="faq-item">
                <h3>What are Nutrition Benchmarks?</h3>
                <p>Nutrition Benchmarks provide data from NHANES (National Health and Nutrition Examination Survey) to help you understand nutritional guidelines and compare your dietary intake.</p>
              </div>
              
              <div className="faq-item">
                <h3>How do I delete my account?</h3>
                <p>Go to your Profile page and click "Delete Account". You'll need to enter your password to confirm the deletion.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
