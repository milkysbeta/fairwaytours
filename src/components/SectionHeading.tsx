import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  title: string
  lede?: string
  align?: 'left' | 'center'
  /** `light` is for the cream spreads, where the dark-ground colours invert. */
  tone?: 'dark' | 'light'
}

export function SectionHeading({ eyebrow, title, lede, align = 'left', tone = 'dark' }: Props) {
  const light = tone === 'light'

  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={light ? 'eyebrow text-turf-600/80' : 'eyebrow'}>{eyebrow}</p>
      <h2
        className={`mt-4 text-4xl leading-[1.08] md:text-5xl ${
          light ? 'text-pine-950' : 'text-bone-50'
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-5 text-base leading-relaxed ${light ? 'text-pine-800/70' : 'text-bone-400'}`}
        >
          {lede}
        </p>
      )}
    </Reveal>
  )
}
