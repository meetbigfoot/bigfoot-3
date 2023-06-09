const g = document.getElementById.bind(document)
const q = document.querySelectorAll.bind(document)

dayjs.extend(dayjs_plugin_relativeTime)

const renderDays = () => {
  for (let i = 0; i < 7; i++) {
    const day = dayjs().add(i, 'd')
    const div = document.createElement('div')
    div.className = 'day'
    div.innerHTML = `<b>${i ? day.format('dddd') : 'Today'}</b>`
    div.addEventListener('click', e => {
      Array.from(e.currentTarget.parentNode.children).forEach(a => a.classList.remove('active'))
      e.currentTarget.classList.add('active')
      fetchEvents(day.format('YYYY-MM-DD'))
    })
    g('day').appendChild(div)
  }
}

let map

const renderMap = coordsArray => {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGJvcm4iLCJhIjoiY2w1Ym0wbHZwMDh3eTNlbnh1aW51cm0ydyJ9.Z5h4Vkk8zqjf6JydrOGXGA'
  map = new mapboxgl.Map({
    center: coordsArray,
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    zoom: 12,
  })
  map.on('style.load', () => q('.day')[0].click())
}

const ls = localStorage.getItem('b3')
let last = ls ? JSON.parse(ls) : {}

if (last.hasOwnProperty('city')) {
  g('location').textContent = last.city
  renderMap([last.longitude, last.latitude])
} else {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=1b976595787f48288932b65d3981e3ae&ip=${data.ip}`)
        .then(response => response.json())
        .then(data => {
          const { city, latitude, longitude } = data
          localStorage.setItem('b3', JSON.stringify({ city, latitude, longitude }))
          g('location').textContent = city
          renderMap([longitude, latitude])
        })
        .catch(error => renderMap([-118.47, 33.99]))
    })
}

const fetchEvents = day => {
  fetch('https://us-central1-samantha-374622.cloudfunctions.net/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city: g('location').textContent,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(
        `Showing ${data.request_params.per_page} of ${data.found} out of ${data.out_of} on page ${data.page}.`,
      )
      const events = data.hits
        .sort((a, b) => a.date_start < b.date_start)
        .filter(ev => dayjs.unix(ev.document.date_start).format('YYYY-MM-DD') === day)
        .map(hit => {
          // console.log(hit)
          const { category, data, description, title } = hit.document
          const { availability, id, images } = JSON.parse(data)
          // console.log(JSON.parse(data))
          const { date, open } = availability.periods[0]
          const when = dayjs(`${date} ${open ? open : '1200'}`, 'YYYY-MM-DD HHmm')
          return {
            date: when.format('ddd MMM D @ ha'),
            fromNow: when.fromNow(),
            ...{ category, description, id, images, title },
          }
        })
      if (events.length) renderEvents(events)
      else alert('No events found!')
    })
}

const renderEvents = events => {
  g('cards').innerHTML = ''
  events.forEach(obj => {
    // console.log(obj)
    const card = document.createElement('div')
    card.className = 'card'
    card.addEventListener('click', e => {
      renderStory({
        date: 'Thursday, May 25, 2023',
        title: '🌇San Francisco Adventure🌉',
        prompt: 'san francisco coffee, patio lunch, and sunset dancing',
        parts: [
          {
            time_of_day: 'morning',
            places: [
              {
                name: 'Jane on Fillmore',
                address: '2123 Fillmore St, San Francisco, CA 94115',
                area: 'Pacific Heights',
                distance: '0.5 miles',
                latitude: 37.78946,
                longitude: -122.43393,
                icon: 'coffee',
                reason: 'Artisanal Coffee & Pastries',
                tags: 'coffee, breakfast, pastries',
                tiktok_query: '#janeonfillmore #sanfrancisco #coffee',
                time_of_day: 'morning',
              },
              {
                name: 'Lyon Street Steps',
                address: 'Lyon St, San Francisco, CA 94115',
                area: 'Presidio Heights',
                distance: '0.7 miles',
                latitude: 37.79056,
                longitude: -122.44734,
                icon: 'hiking',
                reason: 'Scenic Workout',
                tags: 'hiking, workout, views',
                tiktok_query: '#lyonstreetsteps #sanfrancisco #hiking',
                time_of_day: 'morning',
              },
            ],
          },
          {
            time_of_day: 'afternoon',
            places: [
              {
                name: 'Roam Artisan Burgers',
                address: '1923 Fillmore St, San Francisco, CA 94115',
                area: 'Pacific Heights',
                distance: '0.3 miles',
                latitude: 37.78886,
                longitude: -122.43341,
                icon: 'utensils',
                reason: 'Gourmet Burgers & Fries',
                tags: 'lunch, burgers, fries',
                tiktok_query: '#roamartisianburgers #sanfrancisco #burgers',
                time_of_day: 'afternoon',
              },
              {
                name: 'Japantown Peace Plaza',
                address: 'Post St &, Buchanan St, San Francisco, CA 94115',
                area: 'Japantown',
                distance: '1 mile',
                latitude: 37.78555,
                longitude: -122.42938,
                icon: 'landmark',
                reason: 'Cultural Landmark',
                tags: 'japantown, culture, shopping',
                tiktok_query: '#japantown #sanfrancisco #culture',
                time_of_day: 'afternoon',
              },
            ],
          },
          {
            time_of_day: 'evening',
            places: [
              {
                name: 'El Techo de Lolinda',
                address: '2518 Mission St, San Francisco, CA 94110',
                area: 'Mission District',
                distance: '0.5 miles',
                latitude: 37.75692,
                longitude: -122.41845,
                icon: 'cocktail',
                reason: 'Panoramic Rooftop Bar',
                tags: 'drinks, rooftop, views',
                tiktok_query: '#eltechodelolinda #sanfrancisco #cocktails',
                time_of_day: 'evening',
              },
              {
                name: 'Brouwerij West SF',
                address: '1350 Van Ness Ave, San Francisco, CA 94109',
                area: 'Nob Hill',
                distance: '0.9 miles',
                latitude: 37.78982,
                longitude: -122.42256,
                icon: 'beer',
                reason: 'Craft Brewery',
                tags: 'beer, brewery, nightlife',
                tiktok_query: '#brouwerijwestsf #sanfrancisco #beer',
                time_of_day: 'evening',
              },
            ],
          },
        ],
      })
      // window.open(`https://meetbigfoot.com/experience/${obj.id}`)
    })

    const img = document.createElement('div')
    img.className = 'card-img'
    img.style.backgroundImage = `url(${obj.images[0].url})`
    card.appendChild(img)

    const info = document.createElement('div')
    info.className = 'card-info'

    const tag = document.createElement('div')
    tag.className = 'card-tag'
    tag.textContent = obj.category
    info.appendChild(tag)

    const title = document.createElement('h1')
    title.className = 'card-title'
    title.textContent = obj.title
    info.appendChild(title)

    // const location = document.createElement('div')
    // location.className = 'card-location'
    // location.textContent = obj.location.split(',')[0]
    // info.appendChild(location)

    const date = document.createElement('div')
    date.className = 'card-date'
    date.textContent = obj.date
    info.appendChild(date)

    card.appendChild(info)
    g('cards').appendChild(card)
  })
}

renderDays()
