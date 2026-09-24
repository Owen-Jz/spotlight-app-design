# 316 demo: performer photos to generate in Gemini

These are fictional people, so there are no real faces with fake names. Generate each one as a **9:16 portrait** in Gemini (Imagen). Save it as the filename shown and drop it into `316-network/demo/public/media/`. Then tell Claude, and each contestant's `img` in `lib/data.ts` gets switched over.

**Style preamble (paste at the start of every prompt):**
> Cinematic vertical 9:16 photo, shot on a stage during a live talent show, dramatic coloured stage lighting, shallow depth of field, haze in the air, candid mid-performance moment, photoreal, no text, no logos, no watermark.

| File | Contestant | Prompt (after the preamble) |
|---|---|---|
| `p-tolu.jpg` | Tolu Adebayo · Music | A young Nigerian woman singing passionately into a handheld microphone, eyes closed, warm orange and magenta backlight |
| `p-kwame.jpg` | Kwame Mensah · Dance | A young Ghanaian man mid-leap in an Afrobeats dance move, blue and cyan spotlights, motion in his clothes |
| `p-amara.jpg` | Amara Okafor · Poetry | A Nigerian woman in her twenties performing spoken word at a mic stand, one hand raised, soft pink and gold light |
| `p-zawadi.jpg` | Zawadi Njeri · Comedy | A Kenyan woman comedian laughing on stage holding a mic, green and teal light, audience silhouettes in the foreground |
| `p-sipho.jpg` | Sipho Dlamini · The Task | A young South African man outdoors in a city street holding up a phone, taking a photo of a yellow object, daylight, energetic |
| `p-ngozi.jpg` | Ngozi Eze · Agritech idea | A confident Nigerian woman entrepreneur on a pitch stage beside a small solar cold-room model, golden light |
| `p-aisha.jpg` | Aisha Bello · Acting | A Nigerian actress mid-monologue on a theatre stage, single hard spotlight, red and purple tones |
| `p-host.jpg` | Host Tobi | A charismatic Nigerian male TV host in a sharp jacket holding a presenter mic, bright studio light |
