/**
 * Utility for geocoding using OpenStreetMap (Nominatim).
 * This is a free alternative to Google Places API.
 * See: https://nominatim.org/release-docs/latest/api/Search/
 */

export interface GeocodingResult {
  display_name: string
  lat: string
  lon: string
  importance: number
}

export async function searchLocation(
  query: string
): Promise<GeocodingResult[]> {
  if (!query) return []

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=5`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'AI-Lake-Guardian-Hackathon-Project', // Recommendation from Nominatim usage policy
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Geocoding failed:', error)
    return []
  }
}

/**
 * Reverse geocoding: Get address from coordinates
 */
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'AI-Lake-Guardian-Hackathon-Project',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.json()
    return data.display_name || 'Unknown Location'
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    return 'Unknown Location'
  }
}
