// Within a bucket, put is_demo=true homes at the end
function demoLast(arr) {
  return [...arr.filter(h => !h.is_demo), ...arr.filter(h => h.is_demo)]
}

// Editorial curation: 70% domestic (excl. user's city), 30% international
export function curateHomesForUser(homes, userCountryCode, userCity, ratio = 0.7) {
  if (!userCountryCode || homes.length === 0) return demoLast(homes)

  const domestic = []
  const international = []
  const sameCity = []

  for (const h of homes) {
    if (!h.country_code || h.country_code !== userCountryCode) {
      international.push(h)
    } else if (h.city === userCity) {
      sameCity.push(h)
    } else {
      domestic.push(h)
    }
  }

  const domesticSlots = Math.round(ratio * homes.length)
  const intlSlots = homes.length - domesticSlots

  // Fill priority slots first, then overflow, same-city last.
  // Within each bucket, real homes (is_demo=false) precede demo homes.
  return [
    ...demoLast(domestic).slice(0, domesticSlots),
    ...demoLast(international).slice(0, intlSlots),
    ...demoLast(domestic).slice(domesticSlots),
    ...demoLast(international).slice(intlSlots),
    ...demoLast(sameCity),
  ]
}
