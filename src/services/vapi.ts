// Vapi AI Text-to-Speech Service
const VAPI_API_KEY = '69f7575f-3a36-4318-b16c-f6b3f3478b21'

export interface VapiVoiceConfig {
  provider: 'azure' | 'elevenlabs' | 'openai'
  voiceId: string
}

export interface VapiTTSRequest {
  text: string
  voice?: VapiVoiceConfig
}

export class VapiService {
  private apiKey: string
  private baseUrl: string = 'https://api.vapi.ai'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Generate speech from text using Vapi
  async generateSpeech(request: VapiTTSRequest): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/tts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          voice: request.voice || {
            provider: 'azure',
            voiceId: 'en-US-AriaNeural' // Default friendly voice
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Vapi TTS failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.audioUrl || data.url
    } catch (error) {
      console.warn('⚠️ Vapi TTS API unavailable, using Web Speech fallback')
      // Fallback to Web Speech API
      return this.fallbackToWebSpeech(request.text)
    }
  }

  // Fallback to Web Speech API if Vapi fails
  private fallbackToWebSpeech(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Find a good voice
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Aria') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Alex') ||
        voice.lang.startsWith('en')
      )
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8

      utterance.onend = () => resolve('speech-complete')
      utterance.onerror = (error) => reject(error)

      speechSynthesis.speak(utterance)
    })
  }

  // Play audio from URL
  async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      
      audio.onended = () => resolve()
      audio.onerror = (error) => reject(error)
      
      audio.play().catch(reject)
    })
  }

  // Complete TTS flow - generate and play
  async speakText(text: string, voice?: VapiVoiceConfig): Promise<void> {
    try {
      console.log('🎤 Speaking:', text)
      
      if (text.length > 500) {
        // Split long text into chunks
        const chunks = this.splitTextIntoChunks(text, 500)
        for (const chunk of chunks) {
          await this.generateAndPlaySpeech(chunk, voice)
          await new Promise(resolve => setTimeout(resolve, 200)) // Small pause between chunks
        }
      } else {
        await this.generateAndPlaySpeech(text, voice)
      }
    } catch (error) {
      console.warn('⚠️ TTS service unavailable, voice disabled for this session')
      // Silently fail - voice is optional
    }
  }

  private async generateAndPlaySpeech(text: string, voice?: VapiVoiceConfig): Promise<void> {
    try {
      const audioUrl = await this.generateSpeech({ text, voice })
      
      if (audioUrl === 'speech-complete') {
        // Web Speech API was used (synchronous)
        return
      }
      
      // Play the generated audio
      await this.playAudio(audioUrl)
    } catch (error) {
      console.error('Speech generation failed:', error)
      // Final fallback
      await this.fallbackToWebSpeech(text)
    }
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const chunks: string[] = []
    let currentChunk = ''

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence + '. '
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
        }
        currentChunk = sentence + '. '
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  // Grass Bot specific voices
  static getGrassBotVoice(mood: 'friendly' | 'sassy' | 'encouraging' | 'dramatic'): VapiVoiceConfig {
    const voices: Record<string, VapiVoiceConfig> = {
      friendly: {
        provider: 'azure',
        voiceId: 'en-US-AriaNeural'
      },
      sassy: {
        provider: 'azure', 
        voiceId: 'en-US-JennyNeural'
      },
      encouraging: {
        provider: 'azure',
        voiceId: 'en-US-JasonNeural'
      },
      dramatic: {
        provider: 'azure',
        voiceId: 'en-US-GuyNeural'
      }
    }

    return voices[mood] || voices.friendly
  }
}

export const vapiService = new VapiService(VAPI_API_KEY)