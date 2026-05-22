import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FBEVENTS_VERSIONS, DEFAULT_PIXEL_ID } from '../../../lib/config'
import { initPixel } from '../../../lib/initPixel'

const TOTAL_STEPS = 5

// MPA mode: questions navigate client-side (React state), same as the SPA quiz.
// The MPA distinction is at the page level: this page was reached via a full
// page reload (window.location.href from the config page), so a fresh PageView
// fired on load. When the quiz completes, "Continue" does another full page reload
// to the next page in the signup flow — which fires another PageView there.
// Within the quiz itself, no additional PageViews fire.

export default function MpaQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [checked, setChecked] = useState({})
  const [showAdditional, setShowAdditional] = useState(false)

  const pixelId = router.isReady ? (router.query.pixelId || DEFAULT_PIXEL_ID) : DEFAULT_PIXEL_ID
  const fbeventsKey = router.isReady ? (router.query.fbevents || 'cdn') : 'cdn'
  const fbeventsLabel = FBEVENTS_VERSIONS[fbeventsKey]?.label || 'Current (CDN)'

  useEffect(() => {
    if (!router.isReady) return
    const id = router.query.pixelId || DEFAULT_PIXEL_ID
    const url = FBEVENTS_VERSIONS[router.query.fbevents]?.url || FBEVENTS_VERSIONS.cdn.url
    initPixel(id, url)
  }, [router.isReady])

  const done = step >= TOTAL_STEPS
  const progress = done ? 100 : (step / TOTAL_STEPS) * 100

  function advance() { setStep(s => s + 1) }
  function handleRadioChange() { setTimeout(advance, 200) }
  function handleBigButtonClick(e) { e.preventDefault(); setTimeout(advance, 200) }
  function handleSelectAutoAdvance(e) {
    if (e.target.value && e.target.value !== '0') setTimeout(advance, 200)
  }
  function handleCheckboxChange(value) {
    setChecked(prev => {
      const next = { ...prev, [value]: !prev[value] }
      setShowAdditional(Object.values(next).some(Boolean))
      return next
    })
  }

  // Full page reload to the next page in the signup flow.
  // Update this URL when the signup page is added.
  function handleContinue(e) {
    e.preventDefault()
    const params = `pixelId=${encodeURIComponent(pixelId)}&fbevents=${fbeventsKey}`
    window.location.href = `/signup?${params}`
  }

  return (
    <>
      <Head>
        <title>Quiz — MPA — Meta Pixel Demo</title>
      </Head>

      <div id="banner">
        <span className="mode-badge mode-mpa">MPA</span>
        &ensp;fbevents: <strong>{fbeventsLabel}</strong>
        &ensp;&mdash;&ensp;pixel: <strong>{pixelId}</strong>
        &ensp;<a href="/" className="banner-link">← Reconfigure</a>
      </div>

      <div id="quiz-wrap">
        <div id="progress-bar">
          <div id="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <form id="quiz-form" action="#" method="post" autoComplete="off" onSubmit={e => e.preventDefault()}>

          {/* Step 0: Radio (visible input) */}
          {!done && step === 0 && (
            <div className="step">
              <p className="step-note">Radio — input click: no /tr · label-text click: /tr fires</p>
              <div className="question-label">What brings you here today?</div>
              {['Just exploring', 'A specific goal in mind', 'Someone recommended this', 'Not sure yet'].map((opt, i) => (
                <label key={i} className="option-radio">
                  <input type="radio" name="q0" value={i} onChange={handleRadioChange} />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {/* Step 1: Big button (hidden radio, label = button) + show-more
              InferredEvents walks up DOM from click target; fires on wrapper
              div because its class contains "button". Same as BH's div.big_button. */}
          {!done && step === 1 && (
            <div className="step">
              <p className="step-note">Big button — wrapper div class contains "button" → InferredEvents fires /tr on every click</p>
              <div className="question-label">How would you describe your current situation?</div>
              {['Going well overall', 'Some challenges', 'Pretty difficult'].map((opt, i) => (
                <div key={i} className="big-button">
                  <label className="big-opt" onClick={handleBigButtonClick}>
                    <input type="radio" name="q1" value={i} style={{ display: 'none' }} />
                    {opt}
                  </label>
                </div>
              ))}
              {showMore ? (
                ['Very difficult', 'In crisis'].map((opt, i) => (
                  <div key={i} className="big-button">
                    <label className="big-opt" onClick={handleBigButtonClick}>
                      <input type="radio" name="q1" value={3 + i} style={{ display: 'none' }} />
                      {opt}
                    </label>
                  </div>
                ))
              ) : (
                <p className="show-more">
                  <a href="#" onClick={e => { e.preventDefault(); setShowMore(true) }}>Show more options</a>
                </p>
              )}
            </div>
          )}

          {/* Step 2: Select auto-advance */}
          {!done && step === 2 && (
            <div className="step">
              <p className="step-note">Select auto-advance — no /tr</p>
              <div className="question-label">How old are you?</div>
              <select name="q2" defaultValue="0" onChange={handleSelectAutoAdvance}>
                <option value="0">Select your age</option>
                {Array.from({ length: 63 }, (_, i) => i + 18).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
                <option value="81">80+</option>
              </select>
            </div>
          )}

          {/* Step 3: Select + manual Next button */}
          {!done && step === 3 && (
            <div className="step">
              <p className="step-note">Select + Next button — select: no /tr · button: /tr fires</p>
              <div className="question-label">Which region are you in?</div>
              <select name="q3" defaultValue="0">
                <option value="0">Select your region</option>
                {['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast', 'Pacific Northwest', 'International'].map((r, i) => (
                  <option key={i} value={i + 1}>{r}</option>
                ))}
              </select>
              <button type="button" className="next-btn" onClick={advance}>Next</button>
            </div>
          )}

          {/* Step 4: Checkboxes + conditional reveal + Next button */}
          {!done && step === 4 && (
            <div className="step">
              <p className="step-note">Checkboxes — no /tr · Next button: /tr fires</p>
              <div className="question-label">Which of the following apply to you?</div>
              {['Currently a student', 'Employed full-time', 'Employed part-time', 'Self-employed', 'Not currently employed'].map((opt, i) => (
                <label key={i} className="option-checkbox">
                  <input type="checkbox" name="q4" value={i} checked={!!checked[i]} onChange={() => handleCheckboxChange(i)} />
                  {opt}
                </label>
              ))}
              {showAdditional && (
                <div className="additional">
                  <label htmlFor="q4-extra">Anything else? <span className="optional">(optional)</span></label>
                  <textarea id="q4-extra" name="q4_extra" rows={3} />
                </div>
              )}
              <button type="button" className="next-btn" onClick={advance}>Next</button>
            </div>
          )}

          {/* Completion — full page reload to the signup page */}
          {done && (
            <div id="completion">
              <h2>You&rsquo;re all set!</h2>
              <p>Thanks for completing the quiz.</p>
              <button type="button" className="next-btn completion-btn" onClick={handleContinue}>
                Continue →
              </button>
            </div>
          )}

        </form>
      </div>
    </>
  )
}
