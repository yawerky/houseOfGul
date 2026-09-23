'use client'

import { useEffect, useRef, useState } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { jobTypeLabel, type JobEntry } from '@/lib/jobs'

const CV_MAX_BYTES = 5 * 1024 * 1024
const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const field =
  'w-full border border-blush-dark/30 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/60 focus:border-gold focus:outline-none transition-colors duration-300'

const label = 'block text-xs tracking-widest uppercase text-gold mb-2'

export default function CareersBoard({ jobs }: { jobs: JobEntry[] }) {
  const [open, setOpen] = useState<string | null>(jobs.length === 1 ? jobs[0].id : null)
  const [jobId, setJobId] = useState('')
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // The thank-you note is shorter than the form, so the page gets shorter under
  // the reader and leaves them at the footer. Bring the note back into view.
  useEffect(() => {
    if (status === 'sent') panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [status])

  const applyTo = (job: JobEntry) => {
    setJobId(job.id)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const cv = data.get('cv')

    if (!(cv instanceof File) || cv.size === 0) {
      setError('Please attach your CV.')
      setStatus('error')
      return
    }
    if (!CV_TYPES.includes(cv.type)) {
      setError('Please attach a PDF or a Word document.')
      setStatus('error')
      return
    }
    if (cv.size > CV_MAX_BYTES) {
      setError('That file is larger than 5 MB. Please attach a smaller one.')
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/careers/apply', { method: 'POST', body: data })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'We could not receive that. Please try again.')
      form.reset()
      setFileName('')
      setJobId('')
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not receive that. Please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      {/* Open roles, or the plain truth that there are none */}
      <SectionWrapper background="white" padding="md">
        <div className="max-w-2xl mx-auto">
          {jobs.length === 0 ? (
            <>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-6">
                We are not hiring at the moment
              </h2>
              <div className="space-y-4 text-charcoal-light leading-relaxed">
                <p>
                  There is no role open today. When one opens it is usually a single pair of
                  hands, and we need them soon after we decide.
                </p>
                <p>
                  So the form below stays open. Leave your details and your CV and we will keep
                  them on file. When a role comes up, these are the first CVs we read.
                </p>
                <p>
                  If nothing fits, you may not hear from us. We would rather say that plainly
                  than leave you waiting.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">Open roles</h2>
              <p className="text-charcoal-light leading-relaxed mb-8">
                {jobs.length === 1
                  ? 'One role is open. Read it, then send your CV below.'
                  : `${jobs.length} roles are open. Read them, then send your CV below.`}
              </p>

              <div className="divide-y divide-blush-dark/30 border-y border-blush-dark/30">
                {jobs.map((job) => {
                  const isOpen = open === job.id
                  return (
                    <article key={job.id}>
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : job.id)}
                          aria-expanded={isOpen}
                          aria-controls={`job-${job.id}`}
                          className="w-full flex items-start justify-between gap-4 py-6 text-left group"
                        >
                          <span>
                            <span className="block font-serif text-xl text-charcoal group-hover:text-gold transition-colors duration-300">
                              {job.title}
                            </span>
                            <span className="block text-xs tracking-widest uppercase text-charcoal-light mt-2">
                              {jobTypeLabel(job.type)}
                              {job.location ? ` · ${job.location}` : ''}
                            </span>
                            {job.summary && (
                              <span className="block text-sm text-charcoal-light mt-2 leading-relaxed">
                                {job.summary}
                              </span>
                            )}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`mt-1 flex-shrink-0 text-gold text-xl leading-none transition-transform duration-300 ${
                              isOpen ? 'rotate-45' : ''
                            }`}
                          >
                            +
                          </span>
                        </button>
                      </h3>

                      {isOpen && (
                        <div id={`job-${job.id}`} className="pb-8 -mt-1">
                          <div className="space-y-4 text-charcoal-light leading-relaxed">
                            {job.description
                              .split('\n')
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((line, i) => (
                                <p key={i}>{line}</p>
                              ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => applyTo(job)}
                            className="mt-6 px-8 py-3 text-xs tracking-widest uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-colors duration-300"
                          >
                            Apply for this role
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </SectionWrapper>

      {/* The form */}
      <SectionWrapper background="ivory" padding="md">
        <div className="max-w-2xl mx-auto" ref={panelRef}>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4">
            {jobs.length === 0 ? 'Leave your CV with us' : 'Apply'}
          </h2>

          {status === 'sent' ? (
            <div className="border border-gold/40 bg-white px-6 py-10 text-center">
              <p className="font-serif text-2xl text-charcoal mb-3">Thank you</p>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Your application has reached us and your CV is safe with us. We read every one.
                If there is a fit we will write to the address you gave.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-6 text-xs tracking-widest uppercase text-gold hover:text-charcoal transition-colors duration-300"
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <p className="text-charcoal-light leading-relaxed mb-8">
                Tell us how to reach you and attach your CV as a PDF or a Word document, up to
                5 MB. A line or two about the work you have done helps more than a long letter.
              </p>

              <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cv-name" className={label}>
                      Your name
                    </label>
                    <input id="cv-name" name="name" required className={field} placeholder="Full name" />
                  </div>
                  <div>
                    <label htmlFor="cv-email" className={label}>
                      Email
                    </label>
                    <input id="cv-email" name="email" type="email" required className={field} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cv-phone" className={label}>
                      Phone
                    </label>
                    <input id="cv-phone" name="phone" type="tel" required className={field} placeholder="10 digit number" />
                  </div>
                  <div>
                    <label htmlFor="cv-job" className={label}>
                      Applying for
                    </label>
                    <select
                      id="cv-job"
                      name="jobId"
                      className={field}
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                    >
                      <option value="">General application</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="cv-note" className={label}>
                    Anything you would like us to know (optional)
                  </label>
                  <textarea
                    id="cv-note"
                    name="note"
                    rows={4}
                    className={field}
                    placeholder="The work you have done, and what you would like to do here."
                  />
                </div>

                <div>
                  <label htmlFor="cv-file" className={label}>
                    Your CV
                  </label>
                  <input
                    id="cv-file"
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                    className="w-full border border-blush-dark/30 bg-white px-4 py-3 text-sm text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-ivory hover:file:bg-gold file:cursor-pointer cursor-pointer focus:border-gold focus:outline-none transition-colors duration-300"
                  />
                  <p className="text-xs text-charcoal-light mt-2">
                    {fileName ? `Attached: ${fileName}` : 'PDF or Word document, up to 5 MB.'}
                  </p>
                </div>

                {status === 'error' && <p className="text-sm text-red-700">{error}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="px-8 py-3 text-xs tracking-widest uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-colors duration-300 disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending' : 'Send application'}
                  </button>
                  <p className="text-xs text-charcoal-light mt-4 leading-relaxed">
                    Your CV is read by House of Gul only. It is not published anywhere on this
                    site and it is not passed on. Write to contact@houseofgul.in if you would
                    like it removed.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </SectionWrapper>
    </>
  )
}
