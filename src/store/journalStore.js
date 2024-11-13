import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useJournalStore = create(
  persist(
    (set) => ({
      dailyMarkups: {},
      trades: [],
      addDailyMarkup: (date, markup) => {
        set((state) => {
          const formattedDate = new Date(date).toISOString().split('T')[0]
          const existingMarkups = state.dailyMarkups[formattedDate] || []
          
          const newMarkup = {
            ...markup,
            id: Date.now(),
            timestamp: new Date().toISOString()
          }

          return {
            dailyMarkups: {
              ...state.dailyMarkups,
              [formattedDate]: [...existingMarkups, newMarkup]
            }
          }
        })
      },
      updateDailyMarkup: (date, markupId, updatedData) => {
        set((state) => {
          const formattedDate = new Date(date).toISOString().split('T')[0]
          const markupsForDate = state.dailyMarkups[formattedDate] || []
          
          const updatedMarkups = markupsForDate.map(markup => 
            markup.id === markupId 
              ? { ...markup, ...updatedData } 
              : markup
          )

          return {
            dailyMarkups: {
              ...state.dailyMarkups,
              [formattedDate]: updatedMarkups
            }
          }
        })
      },
      updateTrade: (tradeId, updatedData) => {
        set((state) => ({
          trades: state.trades.map(trade => 
            trade.id === tradeId 
              ? { ...trade, ...updatedData } 
              : trade
          )
        }))
      },
      removeDailyMarkup: (date, markupId) => {
        set((state) => {
          const formattedDate = new Date(date).toISOString().split('T')[0]
          const markupsForDate = state.dailyMarkups[formattedDate] || []
          
          const updatedMarkups = markupsForDate.filter(markup => markup.id !== markupId)

          return {
            dailyMarkups: {
              ...state.dailyMarkups,
              [formattedDate]: updatedMarkups
            }
          }
        })
      },
      addTrade: (trade) =>
        set((state) => ({
          trades: [...state.trades, { 
            ...trade, 
            id: Date.now(), 
            date: new Date().toISOString() 
          }]
        })),
      removeTrade: (tradeId) =>
        set((state) => ({
          trades: state.trades.filter((trade) => trade.id !== tradeId)
        }))
    }),
    {
      name: 'trading-journal-storage',
      version: 3
    }
  )
)

export default useJournalStore
