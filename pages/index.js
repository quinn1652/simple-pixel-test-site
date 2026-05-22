import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FBEVENTS_VERSIONS, DEFAULT_PIXEL_ID } from '../lib/config'

export default function ConfigPage() {
  const router = useRouter()
  const [pixelId, setPixelId] = useState(DEFAULT_PIXEL_ID)
  const [fbevents, setFbevents] = useState('cdn')
  const [mode, setMode] = useState('spa')

  function handleStart(e) {
    e.preventDefault()
    const id = pixelId.trim() || DEFAULT_PIXEL_ID
    const params = new URLSearchParams({ pixelId: id, fbevents })
    if (mode === 'spa') {
      router.push(`/quiz/spa?${params}`)
    } else {
      // Full page reload — gives the MPA quiz page a fresh window context and fires a PageView
      window.location.href = `/quiz/mpa?${params}`
    }
  }

  return (
    <>
      <Head>
        <title>Meta Pixel Mechanics Demo</title>
      </Head>

      <div id="config-page">
        <div id="config-card">

          <div id="config-heading">
            <h1>Meta Pixel Mechanics Demo</h1>
            <p>
              A testing tool that illustrates how the Meta Pixel behaves across
              different implementations, and how privacy extensions can block or
              modify that behavior.
            </p>
          </div>

          <form onSubmit={handleStart}>

            <section className="config-section">
              <h2>Pixel ID</h2>
              <input
                type="text"
                className="pixel-id-input"
                value={pixelId}
                onChange={e => setPixelId(e.target.value)}
                placeholder="Enter pixel ID"
                spellCheck={false}
              />
            </section>

            <section className="config-section">
              <h2>fbevents.js Version</h2>
              {Object.entries(FBEVENTS_VERSIONS).map(([key, v]) => (
                <label
                  key={key}
                  className={`config-opt${fbevents === key ? ' config-opt-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="fbevents"
                    value={key}
                    checked={fbevents === key}
                    onChange={() => setFbevents(key)}
                  />
                  <div className="config-opt-text">
                    <strong>{v.label}</strong>
                    <span>{v.description}</span>
                  </div>
                </label>
              ))}
            </section>

            <section className="config-section">
              <h2>Quiz Mode</h2>
              {[
                {
                  value: 'spa',
                  label: 'Single-page app (SPA)',
                  desc: 'React-driven navigation. fbevents.js loads once; PageView fires once per session.',
                },
                {
                  value: 'mpa',
                  label: 'Multi-page (MPA)',
                  desc: 'Full page reload per question. PageView fires on each step. Resembles traditional server-rendered form flows.',
                },
              ].map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`config-opt${mode === value ? ' config-opt-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={value}
                    checked={mode === value}
                    onChange={() => setMode(value)}
                  />
                  <div className="config-opt-text">
                    <strong>{label}</strong>
                    <span>{desc}</span>
                  </div>
                </label>
              ))}
            </section>

            <button type="submit" id="start-btn">Start Quiz →</button>

          </form>
        </div>
      </div>
    </>
  )
}
