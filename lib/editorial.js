// Editorial curation: 70% domestic (excl. user's city), 30% international
export function curateHomesForUser(homes, userCountryCode, userCity, ratio = 0.7) {
  if (!userCountryCode || homes.length === 0) return homes

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

  // Fill priority slots first, then overflow, same-city last
  return [
    ...domestic.slice(0, domesticSlots),
    ...international.slice(0, intlSlots),
    ...domestic.slice(domesticSlots),
    ...international.slice(intlSlots),
    ...sameCity,
  ]
}
