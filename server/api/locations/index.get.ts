import rawData from '../../data/eu_countries_with_city.json'

interface City {
  name: string
  countryName?: string
}

interface CountryData {
  countryName: string
  countryCode: string
  cities: City[]
}

// Build flat list: "City, Country" - cached at module load
const locationItems = (rawData as CountryData[]).flatMap((country) =>
  (country.cities || []).map((city) => ({
    title: `${city.name}, ${country.countryName}`,
    value: `${city.name}, ${country.countryName}`,
    country: country.countryName,
    city: city.name,
  }))
)

export default defineEventHandler(() => {
  return locationItems
})
