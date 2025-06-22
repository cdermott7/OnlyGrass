// Mock implementation for browser compatibility
// Note: In production, these API calls should be made from a backend server

export interface PhotoValidationResult {
  isValid: boolean
  confidence: number
  reason: string
  hasGrass: boolean
  hasHuman: boolean
  location: string
  feedback: string
}

export class GeminiService {
  async validateGrassPhoto(
    imageFile: File,
    expectedLocation: { lat: number; lng: number; name: string }
  ): Promise<PhotoValidationResult> {
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))

    try {
      // Mock validation logic based on image analysis
      const fileName = imageFile.name.toLowerCase()
      const fileSize = imageFile.size
      
      // Basic validation checks
      const hasValidExtension = fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png') || fileName.includes('.heic')
      const hasReasonableSize = fileSize > 50000 && fileSize < 10000000 // 50KB to 10MB
      
      // Enhanced mock validation with location awareness
      const mockAnalysis = this.performEnhancedMockAnalysis(fileName, fileSize, expectedLocation)
      
      // Generate realistic validation result with location-based logic
      const confidence = Math.min(95, Math.max(40, mockAnalysis.baseConfidence + (Math.random() - 0.5) * 20))
      const isValid = hasValidExtension && hasReasonableSize && mockAnalysis.passesLocationCheck && mockAnalysis.hasGrassContent
      
      if (isValid) {
        const successMessages = [
          "Excellent grass touching technique! I can clearly see your hand making contact with the vegetation.",
          "Perfect! The grass touching is evident and the outdoor setting looks authentic.",
          "Great job! This definitely shows proper grass-to-hand contact in what appears to be the right area.",
          "Nice work! The photo clearly shows grass touching activity and the location seems plausible.",
          "Successful validation! Your commitment to outdoor grass interaction is clearly documented."
        ]
        
        return {
          isValid: true,
          confidence: Math.round(confidence),
          reason: 'Photo shows clear evidence of grass touching activity with proper hand-to-vegetation contact',
          hasGrass: true,
          hasHuman: true,
          location: `Outdoor location near ${expectedLocation.name}`,
          feedback: successMessages[Math.floor(Math.random() * successMessages.length)]
        }
      } else {
        const failureReasons = [
          "The photo doesn't clearly show grass touching activity",
          "Unable to identify clear hand-to-grass contact",
          "The image quality makes it difficult to verify grass touching",
          "The photo appears to be taken indoors or doesn't show vegetation clearly"
        ]
        
        const improvementTips = [
          "Try taking the photo outdoors with better lighting and make sure your hand is clearly touching the grass!",
          "Make sure the grass and your hand touching it are both clearly visible in the photo.",
          "Take the photo in good lighting and get closer to show the grass-touching action clearly.",
          "Ensure you're actually outdoors and your hand is making clear contact with real grass or vegetation."
        ]
        
        let failureReason = "Validation failed: "
        
        if (!mockAnalysis.hasGrassContent) {
          failureReason += "No grass detected in image. "
        }
        if (!mockAnalysis.passesLocationCheck) {
          failureReason += "Location doesn't match expected area. "
        }
        if (!mockAnalysis.hasHumanPresence) {
          failureReason += "No human contact visible. "
        }
        
        return {
          isValid: false,
          confidence: Math.round(confidence * 0.6),
          reason: failureReason.trim() || failureReasons[Math.floor(Math.random() * failureReasons.length)],
          hasGrass: mockAnalysis.hasGrassContent,
          hasHuman: mockAnalysis.hasHumanPresence,
          location: `Expected: ${expectedLocation.name}`,
          feedback: "Ensure you're at the correct location and clearly show grass contact."
        }
      }
    } catch (error) {
      console.error('Photo validation error:', error)
      
      // Generous fallback for validation errors
      return {
        isValid: true,
        confidence: 75,
        reason: 'Validation service encountered an issue, but your attempt looks legitimate!',
        hasGrass: true,
        hasHuman: true,
        location: `Near ${expectedLocation.name}`,
        feedback: 'Validation had technical issues, but we believe in your grass-touching commitment! 🌱'
      }
    }
  }

  private performEnhancedMockAnalysis(fileName: string, fileSize: number, expectedLocation: { lat: number; lng: number; name: string }) {
    // Simulate more sophisticated validation
    const hasGrassKeywords = fileName.includes('grass') || fileName.includes('park') || fileName.includes('field')
    const isReasonableSize = fileSize > 100000 && fileSize < 8000000
    
    // Mock location-based validation (simulate checking if photo could be from expected location)
    const locationName = expectedLocation.name.toLowerCase()
    const isKnownParkLocation = locationName.includes('park') || locationName.includes('garden') || locationName.includes('field')
    
    // Simulate GPS location validation with 500m radius
    const passesLocationRadius = this.simulateLocationCheck(expectedLocation)
    
    // Simulate random validation failures to make it realistic (30% chance of failure)
    const randomFactor = Math.random()
    const passesGrassCheck = randomFactor > 0.2 // 80% chance of detecting grass
    const passesLocationCheck = passesLocationRadius && (randomFactor > 0.15) // 85% chance if within radius
    const passesHumanCheck = randomFactor > 0.1 // 90% chance of detecting human
    
    // Calculate base confidence
    let baseConfidence = 50
    if (hasGrassKeywords) baseConfidence += 15
    if (isReasonableSize) baseConfidence += 10
    if (isKnownParkLocation) baseConfidence += 10
    if (passesGrassCheck) baseConfidence += 15
    if (passesLocationCheck) baseConfidence += 10
    
    return {
      hasGrassContent: passesGrassCheck,
      passesLocationCheck: passesLocationCheck && isKnownParkLocation,
      hasHumanPresence: passesHumanCheck,
      baseConfidence,
      passesBasicChecks: isReasonableSize && passesGrassCheck && passesHumanCheck
    }
  }
  
  private simulateLocationCheck(expectedLocation: { lat: number; lng: number; name: string }): boolean {
    // Simulate getting user's current location and checking if within 500m
    // In a real implementation, this would use navigator.geolocation
    
    // Mock current location (simulate user being somewhere around Berkeley)
    const mockUserLat = expectedLocation.lat + (Math.random() - 0.5) * 0.01 // ~500m variation
    const mockUserLng = expectedLocation.lng + (Math.random() - 0.5) * 0.01
    
    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(
      expectedLocation.lat,
      expectedLocation.lng,
      mockUserLat,
      mockUserLng
    )
    
    console.log(`📍 Location validation: Expected (${expectedLocation.lat}, ${expectedLocation.lng}), Mock user (${mockUserLat}, ${mockUserLng}), Distance: ${distance}m`)
    
    // Return true if within 500m radius
    return distance <= 500
  }
  
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
  
  private performMockImageAnalysis(fileName: string, fileSize: number): {
    hasGrass: boolean
    hasHuman: boolean
    passesBasicChecks: boolean
  } {
    // Mock analysis - in reality this would use actual image recognition
    const hasGrass = !fileName.includes('indoor') && !fileName.includes('fake')
    const hasHuman = fileSize > 100000 // Larger files likely have people in them
    const passesBasicChecks = hasGrass && hasHuman && Math.random() > 0.1 // 90% success rate for mock
    
    return { hasGrass, hasHuman, passesBasicChecks }
  }

  async generateGrassDescription(location: { lat: number; lng: number; name: string; address: string }): Promise<string> {
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    try {
      // Mock description generation based on location data
      const descriptions = this.getLocationBasedDescriptions(location)
      return descriptions[Math.floor(Math.random() * descriptions.length)]
    } catch (error) {
      console.error('Failed to generate grass description:', error)
      
      // Fallback descriptions
      const fallbacks = [
        "A suspiciously well-maintained patch of grass that's probably judging your life choices.",
        "This grass has seen things. Mostly feet, but still things.",
        "Premium organic grass, ethically sourced from the ground.",
        "Grass so nice, you'll almost forget you're avoiding real human interaction.",
        "This verdant paradise is just waiting for your vitamin D-deficient touch."
      ]
      
      return fallbacks[Math.floor(Math.random() * fallbacks.length)]
    }
  }

  private getLocationBasedDescriptions(location: { lat: number; lng: number; name: string; address: string }): string[] {
    const name = location.name.toLowerCase()
    const address = location.address.toLowerCase()

    if (name.includes('university') || name.includes('campus') || address.includes('university')) {
      return [
        "Ah yes, the classic university quad grass. Premium grade-A procrastination material.",
        "This emerald carpet has witnessed more existential crises than your therapist.",
        "Academic grass with a PhD in supporting study breaks and questionable life choices.",
        "Campus grass: where dreams go to get stepped on, literally.",
        "University-grade vegetation, perfect for avoiding responsibilities in style."
      ]
    }

    if (name.includes('park') || address.includes('park')) {
      return [
        "Municipal grass with a superiority complex - it knows it's better than your lawn.",
        "Public park grass: democratically accessible to all vitamin D-deficient individuals.",
        "This grass has been taxpayer-funded to judge your life choices. Use it wisely.",
        "City-sanctioned nature experience for those who think hiking is too extreme.",
        "Government-approved outdoor flooring for reformed indoor dwellers."
      ]
    }

    if (name.includes('street') || name.includes('avenue') || address.includes('street')) {
      return [
        "Urban grass strip: surviving against all odds between concrete and car exhaust.",
        "Street-side vegetation with trust issues and a well-developed survival instinct.",
        "This grass has seen more drama than a reality TV show. Approach with respect.",
        "Roadside grass: tougher than your gym membership and more reliable too.",
        "City grass with street cred - literally on the street."
      ]
    }

    if (name.includes('residential') || address.includes('residential')) {
      return [
        "Suburban grass living its best HOA-compliant life while judging yours.",
        "Residential turf with social media aspirations and perfectly trimmed edges.",
        "Neighborhood grass that knows all the local gossip. Touch at your own risk.",
        "This grass is more socially connected than you'll ever be.",
        "Perfectly manicured grass for those who want nature, but make it civilized."
      ]
    }

    // Default descriptions for other locations
    return [
      "Mystery grass with questionable origins but undeniable charm.",
      "Local vegetation that's probably more successful than your last relationship.",
      "This grass patch is having a better life than most people. Inspirational, really.",
      "Nature's carpet sample - now with extra judgment for your indoor lifestyle.",
      "Wild grass living its best life while you contemplate your choices.",
      "Artisanal outdoor flooring with a side of existential contemplation.",
      "This grass knows what you did last summer... indoors. Very disappointing.",
      "Premium ground coverage for aspiring outdoor enthusiasts and reformed hermits."
    ]
  }
}

export const geminiService = new GeminiService()