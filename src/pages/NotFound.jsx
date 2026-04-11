import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | HVAC Sales Master</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Banner
        title="Page Not Found"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: '404' },
        ]}
      />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 32px 80px', fontFamily: "'Figtree', sans-serif" }}>
        <p style={{ fontSize: '18px', color: '#333', lineHeight: 1.75, marginBottom: '24px' }}>
          Looks like this page doesn't exist. Maybe try one of these:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li style={{ fontSize: '17px', lineHeight: 1.6 }}>
            <Link to="/sales" style={{ color: '#4a9fe5', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Sales Training</Link> — real-world HVAC sales strategy
          </li>
          <li style={{ fontSize: '17px', lineHeight: 1.6 }}>
            <Link to="/pro-lessons" style={{ color: '#4a9fe5', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Pro Lessons</Link> — technical training for techs and installers
          </li>
          <li style={{ fontSize: '17px', lineHeight: 1.6 }}>
            <Link to="/resources" style={{ color: '#4a9fe5', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Resources</Link> — free HVAC calculators and tools
          </li>
        </ul>
        <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)', marginTop: '32px' }}>
          Or head back to the <Link to="/" style={{ color: '#4a9fe5', fontWeight: 600 }}>homepage</Link>.
        </p>
      </div>
    </>
  )
}
