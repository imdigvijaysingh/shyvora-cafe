import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      alert("Please fill out required fields.");
      return;
    }
    // Simulate sending email/message
    setIsSent(true);
    setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-cafe-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-cafe-accent font-semibold tracking-widest text-sm mb-4 uppercase">GET IN TOUCH</p>
          <h1 className="font-serif text-4xl md:text-5xl text-cafe-dark mb-6">We'd love to hear from you</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Whether you have a question about our coffee, want to reserve a space for an event, or just want to say hello, we're here for you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Information */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#EBE3D5]">
              <h3 className="font-serif text-xl text-cafe-dark mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cafe-bg rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-cafe-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cafe-dark text-sm mb-1">Our Location</h4>
                    <p className="text-sm text-text-secondary">12 Brew Boulevard,<br />New Delhi 110001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cafe-bg rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-cafe-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cafe-dark text-sm mb-1">Phone Number</h4>
                    <p className="text-sm text-text-secondary">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cafe-bg rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-cafe-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cafe-dark text-sm mb-1">Email Address</h4>
                    <p className="text-sm text-text-secondary">hello@brewandbloom.cafe</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[#EBE3D5]">
                <h4 className="font-semibold text-cafe-dark text-sm mb-4">Opening Hours</h4>
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span>9:00 AM - 11:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#EBE3D5]">
              <h3 className="font-serif text-2xl text-cafe-dark mb-6">Send us a Message</h3>
              
              {isSent && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 animate-fade-in">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cafe-dark mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-cafe-bg/50"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cafe-dark mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-cafe-bg/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cafe-dark mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-cafe-bg/50"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cafe-dark mb-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-cafe-bg/50"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cafe-dark mb-2">Message</label>
                  <textarea 
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-cafe-bg/50 resize-none"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="w-full md:w-auto bg-cafe-darker text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-cafe-dark transition-colors">
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
