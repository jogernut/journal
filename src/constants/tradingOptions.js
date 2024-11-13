export const TRADING_OPTIONS = {
  pairs: ['EUR/USD', 'GBP/USD', 'GBP/JPY', 'AUD/USD', 'XAU/USD'],
  directions: ['Pro Trend (PT)', 'Counter Trend (CT) with Daily PT Support'],
  htfPoi: ['4hr BOS Mitigation', 'No 4hr BOS Mitigation'],
  htfConfluences: ['4hr POI Sweep (Assume PT)', '4hr Swing Alignment'],
  mtfLiquidity: [
    'm15 Left LQ', 
    'm15 Fake Break LQ', 
    '3m LQ (m15 Continuation)', 
    'None (m15 Entry Model Formed 4hr POI)', 
    'm15 LQ as Target'
  ],
  mtfReasoning: [
    'm5 Continuations (Target m15/4hr BOS)', 
    'm15 Continuations - Target 4hr BOS', 
    'm15/m5 Continuations (Target m15/4hr)', 
    'm5 Continuations Target First m15 LQ'
  ],
  mtfCaveats: [
    'm15 Continuations after 4hr BOS', 
    'm5 Sweep within m15 PT', 
    'm5 Continuations after m15 BOS'
  ],
  entryModels: ['Risk Entry', 'Double Break Entry'],
  riskEntryOptions: [
    'm5 OF', 
    'New m5 POI', 
    'm5 POI (Breakline Model)', 
    'm15 OF', 
    'New m15 POI', 
    'm15 POI (Breakline Entry Model)'
  ],
  doubleBreakOptions: ['m1', 'm3', 'm5'],
  results: ['Win', 'Loss', 'Breakeven']
}
