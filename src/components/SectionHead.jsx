import Reveal from './Reveal'
import Eyebrow from './Eyebrow'

/* Reusable section header. `center` centers it; `lead` adds a paragraph. */
export default function SectionHead({ eyebrow, title, lead, center = false, solo = false }) {
  return (
    <Reveal
      className={`mb-14 max-w-[62ch] ${center ? 'mx-auto text-center' : ''}`}
    >
      <Eyebrow solo={solo}>{eyebrow}</Eyebrow>
      <h2 className="font-display mt-[18px] font-extrabold leading-[0.96]" style={{ fontSize: 'clamp(36px,5.4vw,64px)' }}>
        {title}
      </h2>
      {lead && (
        <p className={`mt-5 max-w-[56ch] text-[17px] text-ash ${center ? 'mx-auto' : ''}`}>{lead}</p>
      )}
    </Reveal>
  )
}
