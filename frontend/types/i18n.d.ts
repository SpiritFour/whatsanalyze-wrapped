import 'vue-i18n'

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    common: {
      loading: string
      error: string
      success: string
      cancel: string
      close: string
      save: string
      upload: string
      download: string
      export: string
      share: string
      yes: string
      no: string
      or: string
    }
    nav: {
      privacy: string
      exportGuide: string
      appTitle: string
    }
    footer: {
      privacyFirst: string
      openSource: string
      madeBy: string
      copyright: string
    }
    home: {
      hero: {
        title: string
        subtitle: string
      }
      sections: {
        whatIs: string
        whatToExpect: string
        privacyFirst: string
      }
      features: Array<{
        title: string
        description: string
      }>
      explanations: Array<{
        title: string
        description: string
      }>
    }
    upload: {
      dragDrop: string
      noServerUpload: string
      fileFormats: string
      loading: string
      processingYourData: string
      selectChatFile: string
    }
    exportGuide: {
      title: string
      ios: string
      android: string
      iosSteps: string[]
      androidSteps: string[]
      coming_soon: string
    }
    results: {
      mostEmojis: string
      mostEmojisInOne: string
      messageCount: string
      chatPartners: string
      averageMessageLength: string
      longestStreak: string
      mostActiveTime: string
      leastActiveTime: string
      averageMessagesPerDay: string
      topWords: string
      topEmojis: string
      wordFrequency: string
      emojiFrequency: string
      messageTimeline: string
      activityByDay: string
      activityByHour: string
    }
  }
}
