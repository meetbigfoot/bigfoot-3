const renderStory = plan => {
  const stage = document.createElement('div')
  stage.id = 'stage'
  stage.style.top = `${window.scrollY}px`
  stage.addEventListener('click', e => {
    document.body.style.overflow = 'unset'
    stage.remove()
  })
  document.body.appendChild(stage)
  document.body.style.overflow = 'hidden'

  const close = document.createElement('i')
  close.className = 'fa-solid fa-circle-xmark'
  stage.appendChild(close)

  const story = document.createElement('div')
  story.id = 'story'
  story.addEventListener('click', e => e.stopPropagation())
  stage.appendChild(story)

  // cover
  const cover = document.createElement('div')
  cover.className = 'story'
  cover.id = 'cover'
  story.appendChild(cover)

  const h1 = document.createElement('h1')
  h1.className = 'card-name'
  h1.textContent = plan.title
  cover.appendChild(h1)

  let places = []
  plan.parts.forEach(part => part.places.map(place => places.push(place.name)))

  const desc = document.createElement('p')
  desc.className = 'card-desc'
  // desc.textContent = places.join(' / ')
  desc.textContent = plan.prompt
  cover.appendChild(desc)

  // plan
  const list = document.createElement('div')
  list.className = 'story'
  list.id = 'list'
  story.appendChild(list)

  plan.parts.forEach(part => {
    const group = document.createElement('div')
    group.className = 'plan-group'

    const time = document.createElement('div')
    time.className = 'plan-time-of-day'
    time.textContent = part.time_of_day
    group.appendChild(time)

    const stack = document.createElement('div')
    stack.className = 'plan-stack'
    part.places.forEach(spot => {
      spot.time_of_day = part.time_of_day

      const place = document.createElement('div')
      place.className = 'plan-place'

      const name = document.createElement('h2')
      name.className = 'plan-name'
      name.textContent = spot.name
      place.appendChild(name)

      const reason = document.createElement('div')
      reason.className = 'plan-reason'
      reason.textContent = spot.reason
      place.appendChild(reason)
      stack.appendChild(place)
    })
    group.appendChild(stack)
    list.appendChild(group)
  })

  // map
  const map = document.createElement('div')
  map.className = 'story'
  map.id = 'map2'
  story.appendChild(map)

  let spots = []
  plan.parts.forEach(part => part.places.forEach(spot => spots.push(spot)))

  // console.log(spots[0])

  const mapbox = new mapboxgl.Map({
    center: [spots[0].longitude, spots[0].latitude],
    container: map,
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 14,
  })
  spots.forEach(spot => {
    const marker = document.createElement('div')
    marker.className = 'marker'
    const icon = document.createElement('i')
    icon.className = `fa-solid fa-location-dot`
    marker.appendChild(icon)
    new mapboxgl.Marker(marker).setLngLat([spot.longitude, spot.latitude]).addTo(mapbox)
  })

  // story
  spots.forEach(spot => {
    const place = document.createElement('div')
    place.className = 'story place'

    const group = document.createElement('div')
    group.className = 'plan-group'
    const time = document.createElement('div')
    time.className = 'plan-time-of-day'
    time.textContent = spot.time_of_day
    group.appendChild(time)
    const stack = document.createElement('div')
    stack.className = 'plan-stack'
    const name = document.createElement('h2')
    name.className = 'plan-name'
    name.textContent = spot.name
    stack.appendChild(name)
    const reason = document.createElement('div')
    reason.className = 'plan-reason'
    reason.textContent = 'missing reason'
    stack.appendChild(reason)

    group.appendChild(stack)
    place.appendChild(group)

    story.appendChild(place)
  })

  // progress
  const progress = document.createElement('div')
  progress.id = 'progress'
  story.appendChild(progress)

  const children = Array.from(story.childNodes).slice(0, -1)
  children.forEach((child, i) => {
    const segment = document.createElement('div')
    segment.className = ['progress-segment', i ? null : 'active'].join(' ')
    progress.appendChild(segment)
  })

  // controls
  let current = 0

  const next = document.createElement('div')
  next.id = 'next'
  next.addEventListener('click', e => {
    if (current < children.length - 1) current++
    children[current].style.zIndex = 2
    const bars = Array.from(progress.childNodes)
    bars[current].classList.add('active')
    bars[current - 1].classList.remove('active')
    bars[current - 1].classList.add('seen')
  })
  story.appendChild(next)
}
