import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  title: string
  lede?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, lede, align = 'left' }: Props) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl leading-[1.08] text-bone-50 md:text-5xl">{title}</h2>
      {lede && <p className="mt-5 text-base leading-relaxed text-bone-400">{lede}</p>}
    </Reveal>
  )
}
