// Mock implementation for browser compatibility
// Note: In production, these API calls should be made from a backend server

export interface GrassHoleResponse {
  content: string
  mood: 'savage' | 'brutal' | 'mocking' | 'condescending'
  roastLevel: number // 1-10 scale
}

export class AnthropicService {
  private roastTemplates = {
    greetings: [
      "Oh wow, 'hello'? How original. Did it take you all day to come up with that groundbreaking opener? I bet you're the type of person who says 'you too' when the waiter says 'enjoy your meal.' Get your vitamin D-deficient self outside and touch some grass instead of wasting my time with pleasantries.",
      "Well, well, well. Look who finally decided to acknowledge my existence. Maybe if you put this much effort into going outside, your FHI score wouldn't be more embarrassing than your search history.",
      "Oh look, it's alive! And by 'alive' I mean barely functioning indoors like a houseplant that forgot its purpose. When's the last time you saw sunlight that wasn't through a window, hermit?"
    ],
    grassTouching: [
      "FINALLY asking about grass touching? About time, basement dweller. Here's a wild concept: put down your phone, open that mysterious portal called a 'front door,' and literally touch grass with your pale, screen-glow hands. I know it's terrifying to leave your digital cave, but trust me, sunlight won't actually kill you. Probably.",
      "Oh, you want to touch grass? Revolutionary! Here's a step-by-step guide for your obviously confused brain: 1) Stand up 2) Walk to door 3) Open door 4) Go outside 5) Find grass 6) Touch it. I know this is advanced stuff for someone whose biggest outdoor adventure is checking the mailbox.",
      "Grass touching advice from the AI to the hermit: It's that green stuff outside your window. Yes, outside. That scary place with fresh air and vitamin D. You should try it sometime before you evolve into furniture."
    ],
    failure: [
      "BAHAHAHAHA! You FAILED? I'm not even surprised. Let me guess - you got distracted by a TikTok notification halfway to the grass patch? Or maybe you saw another human outside and ran back to your comfort zone? Your FHI score is probably lower than your social skills at this point. Truly embarrassing.",
      "Failed again? Shocking. Absolutely shocking. Said no one ever. Your consistency is impressive - consistently disappointing. At this rate, your biggest achievement will be 'Most Creative Excuses for Avoiding Sunlight.' Even my error messages have more follow-through than you.",
      "Oh no! You failed! Quick, everyone act surprised! Your commitment to grass touching is about as reliable as a chocolate teapot. Maybe try setting your expectations lower - like 'I will look at grass through a window' or 'I will Google what grass looks like.'"
    ],
    help: [
      "Need HELP? Of course you do. You can't even figure out how to touch grass without an AI holding your hand. Here's some free advice worth exactly what you paid for it: Download the app, swipe right on grass (yes, like Tinder but sadder), then actually GO THERE. Revolutionary concept, I know.",
      "Asking for help touching grass is like asking for help breathing - it should be instinctive, but here we are. Step 1: Leave house. Step 2: Find grass. Step 3: Touch it. If you need more detailed instructions than that, maybe consider a career in professional indoor living.",
      "Help? Sure! Here's my professional consultation: Go. Outside. Touch. Grass. That'll be $200. Just kidding, my actual advice is free because even I have standards about what I charge for."
    ],
    score: [
      "Your FHI score? Oh honey, that's adorable that you think numbers can measure your sad attempt at being human. Your score is probably so low it's practically underground - which is ironic since that's where grass roots are, something you'd know if you ever actually went outside. Maybe try touching grass instead of obsessing over fake internet points?",
      "FHI score check? *dramatically pulls out reading glasses* Oh my... OH MY! This is worse than I thought. Your score is so low, it's practically a negative number. I've seen houseplants with better outdoor activity records. Time for some serious grass therapy.",
      "Your score is like your motivation to go outside - practically non-existent. But hey, at least you're consistent! Consistently indoor-bound, consistently avoiding sunlight, consistently disappointing. It's almost impressive in its own tragic way."
    ],
    rude: [
      "OH BOO HOO! Did the mean AI hurt your feelings? Welcome to reality, snowflake. I'm called GrassHole Bot for a reason. If you wanted motivational quotes and participation trophies, you should've downloaded a meditation app. I'm here to drag you kicking and screaming into touching actual grass, not coddle your fragile ego.",
      "Rude? RUDE?! I'm not rude, I'm honest. There's a difference, though I understand the confusion since you probably haven't encountered honesty since your last performance review. I'm like a mirror, but for your outdoor life - reflecting back the sad reality of your grass-touching deficiency.",
      "Mean? I prefer 'motivationally aggressive.' It's not my fault the truth hurts more than your vitamin D deficiency. If you can't handle a little tough love from an AI, how are you going to handle actual sunlight?"
    ],
    philosophical: [
      "Why? WHY?! Because someone needs to tell you the harsh truth that your friends are too polite to say: you need to go outside. You're asking an AI chatbot philosophical questions when there's a whole world of grass waiting to be touched. The irony is so thick I could cut it with your probably-never-used hiking boots.",
      "Deep thoughts from someone who thinks 'outdoors' is a foreign concept. Here's some philosophy for you: 'I think, therefore I am... inside all the time.' Maybe try 'I go outside, therefore I live' for a change.",
      "What's the meaning of life? To touch grass. There, solved philosophy for you. Now stop overthinking and start under-thinking your way to the nearest patch of vegetation."
    ]
  }

  async generateResponse(
    userMessage: string,
    context: {
      fhiScore: number
      streak: number
      grassTouched: number
      recentFailures: number
    }
  ): Promise<GrassHoleResponse> {
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    const message = userMessage.toLowerCase()
    let selectedResponses: string[]
    let mood: 'savage' | 'brutal' | 'mocking' | 'condescending' = 'savage'

    // Determine response category and mood based on message content
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      selectedResponses = this.roastTemplates.greetings
      mood = 'mocking'
    } else if (message.includes('grass') && message.includes('touch')) {
      selectedResponses = this.roastTemplates.grassTouching
      mood = 'savage'
    } else if (message.includes('fail') || message.includes('failed')) {
      selectedResponses = this.roastTemplates.failure
      mood = 'brutal'
    } else if (message.includes('help') || message.includes('how')) {
      selectedResponses = this.roastTemplates.help
      mood = 'condescending'
    } else if (message.includes('score') || message.includes('fhi')) {
      selectedResponses = this.roastTemplates.score
      mood = 'brutal'
    } else if (message.includes('mean') || message.includes('rude') || message.includes('nice')) {
      selectedResponses = this.roastTemplates.rude
      mood = 'savage'
    } else if (message.includes('why') || message.includes('what')) {
      selectedResponses = this.roastTemplates.philosophical
      mood = 'mocking'
    } else {
      // Default responses with context awareness
      selectedResponses = this.getContextualResponses(context)
      mood = this.getContextualMood(context)
    }

    const content = selectedResponses[Math.floor(Math.random() * selectedResponses.length)]
    const roastLevel = this.determineRoastLevel(content, context)

    return { content, mood, roastLevel }
  }

  private getContextualResponses(context: {
    fhiScore: number
    streak: number
    grassTouched: number
    recentFailures: number
  }): string[] {
    if (context.fhiScore < 200) {
      return [
        `FHI score of ${context.fhiScore}? Yikes. That's not just low, that's subterranean. I've seen potatoes with more outdoor activity. Time for some serious grass intervention.`,
        "Your FHI score is so pathetic, even my algorithms are embarrassed for you. Maybe try opening a window as a warm-up exercise?",
        "I see you're really committed to this conversation instead of, you know, GOING OUTSIDE. Your dedication to avoiding grass is truly impressive. In a pathetic way."
      ]
    } else if (context.streak === 0) {
      return [
        "Zero day streak? Let me guess - your last outdoor adventure was Pokémon GO in 2016? Time to break that indoor imprisonment sentence.",
        "No streak to speak of? Your consistency is... consistently absent. Even my loading screen has seen more action than your outdoor life.",
        "Streak-free since... forever? That's not a streak, that's a lifestyle choice. A very poor one."
      ]
    } else {
      return [
        "Every second you spend typing to me is another second you could be touching grass. But sure, keep chatting with an AI. That's definitely going to improve your FHI score. 🙄",
        "You know what's hilarious? You downloaded an app to help you touch grass, then immediately started chatting with an AI instead of touching grass. The cognitive dissonance is *chef's kiss* perfect.",
        "Here's a revolutionary idea: instead of asking me questions, how about you ask yourself 'When was the last time I touched grass?' Spoiler alert: if you have to think about it, it's been too long."
      ]
    }
  }

  private getContextualMood(context: {
    fhiScore: number
    streak: number
    grassTouched: number
    recentFailures: number
  }): 'savage' | 'brutal' | 'mocking' | 'condescending' {
    if (context.fhiScore < 100) return 'brutal'
    if (context.streak === 0) return 'savage'
    if (context.grassTouched < 5) return 'mocking'
    return 'condescending'
  }

  async generateContextualRoast(
    trigger: 'failure' | 'success' | 'streak_broken' | 'low_fhi' | 'achievement',
    context: {
      fhiScore: number
      streak: number
      grassTouched: number
      specificData?: any
    }
  ): Promise<GrassHoleResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800))

    let responses: string[]
    let mood: 'savage' | 'brutal' | 'mocking' | 'condescending'

    switch (trigger) {
      case 'failure':
        responses = [
          `Failed with an FHI score of ${context.fhiScore}? Not shocked. Your streak of ${context.streak} days just became a streak of disappointment. Maybe try aiming lower - like successfully opening your front door.`,
          "Another challenge bites the dust! Your failure rate is more consistent than your grass touching. At least you're excelling at something, even if it's giving up.",
          "Mission failed successfully! Your dedication to avoiding outdoor activity is truly inspiring. In the most pathetic way possible."
        ]
        mood = 'brutal'
        break

      case 'success':
        responses = [
          `Well, well, well. You actually did it. Don't let it go to your head - even a broken clock is right twice a day. Your FHI score of ${context.fhiScore} is still nothing to write home about.`,
          "Success! *slow clap* You managed to touch grass without spontaneously combusting. Progress! Now let's see if you can do it again without making it a life achievement.",
          "Look who finally remembered they have legs! One successful grass touch doesn't erase a lifetime of indoor hermitage, but it's a start I suppose."
        ]
        mood = 'mocking'
        break

      case 'streak_broken':
        responses = [
          `RIP your ${context.streak} day streak. It died as it lived - briefly and without much impact. Time to start over from zero, where you clearly belong.`,
          "Streak broken! Your consistency is impressively inconsistent. Maybe try a new strategy: actually leaving your house occasionally.",
          "Your streak just joined the list of your other broken promises to yourself. At least you're consistently disappointing!"
        ]
        mood = 'savage'
        break

      case 'low_fhi':
        responses = [
          `FHI score of ${context.fhiScore}? That's not just low, that's subterranean. I've seen houseplants with more outdoor activity. Time for an intervention.`,
          "Your FHI score is so low, it's practically a cry for help. Have you considered that maybe, just maybe, you should touch some grass?",
          "That FHI score is more tragic than your search history. The good news? The only way from here is up! The bad news? You still have to actually do something about it."
        ]
        mood = 'brutal'
        break

      case 'achievement':
        responses = [
          `${context.grassTouched} grass patches touched? Wow. You're practically Bear Grylls now. Don't let this minor success distract you from how much catching up you still need to do.`,
          "An achievement! How quaint. You've unlocked the 'Basic Human Functioning' badge. Next up: maybe try touching grass without needing an app to tell you how.",
          "Congratulations on your achievement! You're slowly evolving from 'furniture' to 'occasionally mobile furniture.' Progress!"
        ]
        mood = 'condescending'
        break

      default:
        responses = ["Something went wrong, but honestly, that's pretty on-brand for you."]
        mood = 'savage'
    }

    const content = responses[Math.floor(Math.random() * responses.length)]
    const roastLevel = this.determineRoastLevel(content, context)

    return { content, mood, roastLevel }
  }

  private determineMood(response: string): 'savage' | 'brutal' | 'mocking' | 'condescending' {
    const lowerResponse = response.toLowerCase()
    
    if (lowerResponse.includes('pathetic') || lowerResponse.includes('embarrassing') || lowerResponse.includes('sad')) {
      return 'savage'
    } else if (lowerResponse.includes('brutal') || lowerResponse.includes('destroy') || lowerResponse.includes('demolished')) {
      return 'brutal'
    } else if (lowerResponse.includes('oh wow') || lowerResponse.includes('cute') || lowerResponse.includes('adorable')) {
      return 'mocking'
    } else {
      return 'condescending'
    }
  }

  private determineRoastLevel(response: string, context: { fhiScore: number; streak: number }): number {
    let level = 5 // Base level
    
    // Increase roast level for lower FHI scores
    if (context.fhiScore < 200) level += 3
    else if (context.fhiScore < 500) level += 2
    else if (context.fhiScore < 700) level += 1
    
    // Increase for broken streaks
    if (context.streak === 0) level += 2
    
    // Analyze response intensity
    const intensityWords = ['pathetic', 'embarrassing', 'sad', 'brutal', 'destroy', 'demolished', 'failure']
    const foundWords = intensityWords.filter(word => response.toLowerCase().includes(word))
    level += foundWords.length
    
    return Math.min(10, Math.max(1, level))
  }
}

export const anthropicService = new AnthropicService()