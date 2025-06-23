import { Loader } from '@googlemaps/js-api-loader'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

if (!API_KEY) {
  console.error('Google Maps API key not found in environment variables')
}

const loader = new Loader({
  apiKey: API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry', 'streetView']
})

export interface GrassLocation {
  lat: number
  lng: number
  address: string
  city: string
  placeId: string
  satelliteImageUrl: string
  distanceFromUser: number
}

export class GoogleMapsService {
  private google: typeof window.google | null = null
  private map: google.maps.Map | null = null
  private isLoaded = false

  async initialize(): Promise<void> {
    if (this.isLoaded) return

    try {
      this.google = await loader.load()
      this.isLoaded = true
      console.log('Google Maps API loaded successfully')
    } catch (error) {
      console.error('Failed to load Google Maps API:', error)
      throw error
    }
  }

  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Default to San Francisco if geolocation fails
          resolve({
            lat: 37.7749,
            lng: -122.4194
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  async findGrassPatches(userLocation: { lat: number; lng: number }, radiusKm: number = 1): Promise<GrassLocation[]> {
    if (!this.google) {
      await this.initialize()
    }

    try {
      // Use the new Place API with correct field names
      const request = {
        fields: ['id', 'displayName', 'location', 'formattedAddress'],
        locationRestriction: {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          radius: radiusKm * 1000 // Convert km to meters
        },
        includedTypes: ['park', 'tourist_attraction', 'amusement_park', 'campground', 'national_park'],
        maxResultCount: 20
      }

      // Use the new searchNearby method with Place API
      const { Place } = await this.google!.maps.importLibrary("places") as google.maps.PlacesLibrary
      const { places } = await Place.searchNearby(request)

      const grassLocations: GrassLocation[] = []

      for (const place of places || []) {
        if (place.location && place.id) {
          const lat = place.location.lat()
          const lng = place.location.lng()
          
          // Calculate distance from user
          const distance = this.calculateDistance(
            userLocation.lat, userLocation.lng,
            lat, lng
          )

          // Only include places within the specified radius
          if (distance <= radiusKm * 1000) {
            const grassLocation: GrassLocation = {
              lat,
              lng,
              address: place.formattedAddress || place.displayName?.text || 'Unknown location',
              city: this.extractCity(place.formattedAddress || place.displayName?.text || ''),
              placeId: place.id,
              satelliteImageUrl: this.generateSatelliteImageUrl(lat, lng),
              distanceFromUser: Math.round(distance)
            }
            
            grassLocations.push(grassLocation)
          }
        }
      }

      // Sort by distance from user
      grassLocations.sort((a, b) => a.distanceFromUser - b.distanceFromUser)
      
      if (grassLocations.length > 0) {
        return grassLocations
      } else {
        // Return fallback locations if no places found
        return this.getFallbackLocations(userLocation)
      }

    } catch (error) {
      console.warn('⚠️ New Place API failed, falling back to local locations:', error)
      // Return some fallback locations around the user's area
      return this.getFallbackLocations(userLocation)
    }
  }

  generateSatelliteImageUrl(lat: number, lng: number, zoom: number = 18): string {
    const size = '640x640'
    const mapType = 'satellite'
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${mapType}&key=${API_KEY}`
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  private extractCity(address: string): string {
    const parts = address.split(', ')
    if (parts.length >= 2) {
      return parts[parts.length - 2] // Usually the city is second to last
    }
    return 'Unknown City'
  }

  private getFallbackLocations(userLocation: { lat: number; lng: number }): GrassLocation[] {
    // Check if user is near Berkeley area
    const isBerkeley = this.calculateDistance(userLocation.lat, userLocation.lng, 37.8719, -122.2585) < 10000
    
    let fallbackPlaces
    
    if (isBerkeley) {
      // Berkeley area grass patches
      fallbackPlaces = [
        { lat: 37.8723, lng: -122.2585, name: 'UC Berkeley Campus', address: 'UC Berkeley Campus, Berkeley, CA' },
        { lat: 37.8688, lng: -122.2646, name: 'People\'s Park', address: 'People\'s Park, Berkeley, CA' },
        { lat: 37.8797, lng: -122.2678, name: 'Berkeley Marina Park', address: 'Berkeley Marina Park, Berkeley, CA' },
        { lat: 37.8836, lng: -122.2675, name: 'Cesar Chavez Park', address: 'Cesar Chavez Park, Berkeley, CA' },
        { lat: 37.8648, lng: -122.2594, name: 'Willard Park', address: 'Willard Park, Berkeley, CA' },
        { lat: 37.8581, lng: -122.2677, name: 'Aquatic Park', address: 'Aquatic Park, Berkeley, CA' },
        { lat: 37.8756, lng: -122.2474, name: 'Tilden Regional Park', address: 'Tilden Regional Park, Berkeley, CA' }
      ]
    } else {
      // San Francisco area fallback
      fallbackPlaces = [
        { lat: 37.7749, lng: -122.4194, name: 'Golden Gate Park', address: 'Golden Gate Park, San Francisco, CA' },
        { lat: 37.8024, lng: -122.4058, name: 'Crissy Field', address: 'Crissy Field, San Francisco, CA' },
        { lat: 37.7576, lng: -122.5131, name: 'Ocean Beach', address: 'Ocean Beach, San Francisco, CA' },
        { lat: 37.7694, lng: -122.4862, name: 'Alamo Square Park', address: 'Alamo Square Park, San Francisco, CA' },
        { lat: 37.7544, lng: -122.4477, name: 'Mission Dolores Park', address: 'Mission Dolores Park, San Francisco, CA' }
      ]
    }

    return fallbackPlaces.map((place, index) => ({
      lat: place.lat,
      lng: place.lng,
      address: place.address,
      city: isBerkeley ? 'Berkeley' : 'San Francisco',
      placeId: `fallback_${index}`,
      satelliteImageUrl: this.generateSatelliteImageUrl(place.lat, place.lng),
      distanceFromUser: Math.round(this.calculateDistance(
        userLocation.lat, userLocation.lng,
        place.lat, place.lng
      ))
    }))
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    if (!this.google) {
      await this.initialize()
    }

    const geocoder = new this.google!.maps.Geocoder()
    const latlng = new this.google!.maps.LatLng(lat, lng)

    return new Promise((resolve) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address)
        } else {
          resolve(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        }
      })
    })
  }
}

export const googleMapsService = new GoogleMapsService()