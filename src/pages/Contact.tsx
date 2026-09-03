import React, { JSX, useState } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import useSendContactEmail from '../network/useSendContactEmail';
import '../styles/IntroHome.css';

function Contact(): JSX.Element {
  const [message, setMessage] = useState('');
  const { mutate, isPending, isError, isSuccess, error } = useSendContactEmail();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(message);
  };

  return (
    <div className="intro-home">
      <TopNav />
      <section className="intro-header-bar" aria-label="Contact overview" />
      <main className="container intro-main">
        <div className="intro-content-layout contact-content-layout">
          <section className="intro-copy-block">
            <h1>Contact</h1>
            <p className="contact-intro">
              Reach out about a role, a project, or a collaboration. Send a quick note and I&apos;ll get back to you.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <label htmlFor="contact-message" className="contact-label">Message</label>
              <textarea
                id="contact-message"
                className="contact-textarea"
                rows={10}
                placeholder="Tell me a little about what you are building or what you are looking for..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />

              <button type="submit" className="contact-submit-button" disabled={isPending}>
                {isPending ? 'Sending...' : 'Send Message'}
              </button>

              {isSuccess && (
                <p className="contact-status success">Your message has been queued successfully.</p>
              )}

              {isError && (
                <p className="contact-status error">
                  {error instanceof Error ? error.message : 'Something went wrong while sending your message.'}
                </p>
              )}
            </form>
          </section>
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}

export default Contact;
