# Imagery

## Status: placeholders, not cleared for launch

Every image currently in this folder was taken from the client moodboard
(`nz.pinterest.com/distortionsweet/golf-website-j-rat`) at the client's
direction, to get real photography into the layout in place of gradients.

**None of it has a known licence or a known photographer.** Pinterest is an
index, not a rights holder — several of these look like stock library images or
AI-generated compositions, and at least one is not New Zealand at all
(`courses/jacks-point.jpg` is an alpine lake in southern Europe).

Publishing them on a live commercial site risks a takedown or an invoice. They
are fine for design review and client sign-off; they are not fine for launch.

## What replaces them

The client holds a local image folder at `A:\PROJECTS\FairwayTours.co.nz\IMAGES`.
Drop those files in using the filenames below and they take over automatically —
no code change needed.

| Path | Shows | Wanted instead |
| --- | --- | --- |
| `hero/poster.jpg` | Aerial river course at sunrise | Drone still over Jacks Point or The Hills |
| `hero/01-arrival.mp4` | *(missing)* | Arrival: airport, vehicle, Crown Range |
| `hero/02-course.mp4` | *(missing)* | Approach to a course |
| `hero/03-play.mp4` | *(missing)* | Play, mid-round |
| `hero/04-table.mp4` | *(missing)* | Dinner, evening |
| `courses/wanaka.jpg` | Ball at the hole, sunrise | Wānaka Golf Club |
| `courses/millbrook.jpg` | Aerial green and pond | Millbrook Resort |
| `courses/the-hills.jpg` | Aerial bunkers | The Hills, ideally with sculpture |
| `courses/jacks-point.jpg` | European alpine lake | Jacks Point lakeside stretch |
| `courses/arrowtown.jpg` | Autumn leaves | Arrowtown in autumn |
| `experiences/table.jpg` | Martini glasses on a fairway | Private dining |
| `experiences/clubs.jpg` | Clubs in a bag | High-country or equipment detail |
| `jacob.jpg` | *(missing)* | Portrait of Jacob |
| `cut-grass.png` | Generated turf with a blade-cut lower edge | The client's own cut-grass.png |

### Replacing cut-grass.png

Drop the file in at `public/media/cut-grass.png` — no code change needed. For it
to work as a section transition it needs:

- **Solid across the top.** The top edge butts against a dark section, so the
  first few rows must be fully opaque. The current file starts at `#04140f`,
  which is the page ground colour.
- **Transparent at the bottom**, with the cut dissolving gradually rather than
  ending on a line. Abrupt endings read as a sticker.
- **Wide.** It is stretched across the full viewport with `object-cover`, so
  1800px or more, otherwise it softens on a large monitor.
- Roughly 4:1. The current placeholder is 2400×620.

The component draws it twice at different scroll rates. The back copy is
blurred and knocked back to 40% — if your image is much busier than the
placeholder, that back layer may want turning down further in
`components/GrassDivider.tsx`.

Anything still missing falls back to a gradient rather than a broken frame, so
the site stays presentable while the shoot is arranged.

## For the real shoot

The moodboard is consistent about what works: **aerials**. Top-down and
low-oblique drone frames of greens, bunkers and water carry the whole reference
set, and they are what makes this look like a premium travel brand rather than a
club website. A drone day over Jacks Point and The Hills in autumn light would
supply the hero, the course cards and most of a season of social content.
