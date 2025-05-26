import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './App.css'
import { Chains, Session, SessionKit } from '@wharfkit/session'
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor'
import WebRenderer from '@wharfkit/web-renderer'
import React from 'react'
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Wrench, 
  Calculator, 
  RefreshCw, 
  AlertCircle, 
  Crown, 
  Lock, 
  Download,
  BarChart3,
  TrendingDown,
  Wallet,
  CheckCircle
} from 'lucide-react'

const sessionKit = new SessionKit({
  appName: 'Ranchers ROI Premium',
  chains: [Chains.WAX],
  ui: new WebRenderer(),
  walletPlugins: [
    new WalletPluginAnchor(),
  ],
})

// Subscription configuration
const SUBSCRIPTION_CONFIG = {
  price: '10.0000 WAX', // 10 WAX for 1 month
  duration: 30 * 24 * 60 * 60, // 30 days in seconds
  recipient: 'rancherprem1', // Premium subscription wallet
}

interface TokenPrices {
  FARM: number;
  RANCH: number;
  TOOL: number;
}

interface Subscription {
  user: string;
  expiresAt: number;
  active: boolean;
}

// NFT Config data from the ranchersland contract
const nftConfigs = [
  {
    template_id: 890182,
    nft_name: "Goose Coop",
    type: "Ranch",
    rarity: "Basic",
    consumed: { first: 5, second: 3 },
    max_durability: 100,
    mints: ["135.0000 TOOL", "800.0000 RANCH"],
    rewards: ["1.7000 RANCH"],
    charged_time: 3600
  },
  {
    template_id: 890183,
    nft_name: "Chicken Coop", 
    type: "Ranch",
    rarity: "Common",
    consumed: { first: 10, second: 5 },
    max_durability: 100,
    mints: ["400.0000 TOOL", "2400.0000 RANCH"],
    rewards: ["5.0000 RANCH"],
    charged_time: 3600
  },
  {
    template_id: 890184,
    nft_name: "Stable",
    type: "Ranch",
    rarity: "Uncommon",
    consumed: { first: 30, second: 15 },
    max_durability: 300,
    mints: ["1200.0000 TOOL", "7200.0000 RANCH"],
    rewards: ["17.0000 RANCH"],
    charged_time: 3600
  },
  {
    template_id: 890185,
    nft_name: "Barn",
    type: "Ranch",
    rarity: "Rare",
    consumed: { first: 60, second: 45 },
    max_durability: 900,
    mints: ["3600.0000 TOOL", "21600.0000 RANCH"],
    rewards: ["54.0000 RANCH"],
    charged_time: 3600
  },
  {
    template_id: 890186,
    nft_name: "Sickle",
    type: "Farm",
    rarity: "Common",
    consumed: { first: 0, second: 5 },
    max_durability: 250,
    mints: ["200.0000 TOOL", "1200.0000 RANCH"],
    rewards: ["5.0000 FARM"],
    charged_time: 3600
  },
  {
    template_id: 890187,
    nft_name: "Scythe",
    type: "Farm",
    rarity: "Uncommon",
    consumed: { first: 0, second: 20 },
    max_durability: 1000,
    mints: ["800.0000 TOOL", "4800.0000 RANCH"],
    rewards: ["20.0000 FARM"],
    charged_time: 3600
  },
  {
    template_id: 890188,
    nft_name: "Harvester",
    type: "Farm",
    rarity: "Rare",
    consumed: { first: 0, second: 32 },
    max_durability: 1600,
    mints: ["3200.0000 TOOL", "19200.0000 RANCH"],
    rewards: ["80.0000 FARM"],
    charged_time: 3600
  },
  {
    template_id: 890189,
    nft_name: "Workshop",
    type: "Tool",
    rarity: "Common",
    consumed: { first: 133, second: 5 },
    max_durability: 250,
    mints: ["4000.0000 TOOL", "24000.0000 RANCH"],
    rewards: ["100.0000 TOOL"],
    charged_time: 7200
  }
];

function App() {
  const [session, setSession]: [Session | undefined, Dispatch<SetStateAction<Session | undefined>>] = useState()
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({ FARM: 0, RANCH: 0, TOOL: 0 })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    sessionKit.restore().then((restored) => {
      setSession(restored)
      if (restored) {
        checkSubscription(restored.actor.toString())
      }
    })
  }, [])

  useEffect(() => {
    fetchTokenPrices()
    const interval = setInterval(fetchTokenPrices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchTokenPrices = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const tokens = ['FARM', 'RANCH', 'TOOL']
      const prices: Partial<TokenPrices> = {}
      
      for (const token of tokens) {
        try {
          const url = `https://alcor.exchange/api/v2/tokens/${token.toLowerCase()}-ranchersbank`
          const response = await fetch(url)
          
          if (response.ok) {
            const data = await response.json()
            prices[token as keyof TokenPrices] = data.usd_price || 0
          } else {
            prices[token as keyof TokenPrices] = 0
          }
        } catch (tokenError) {
          console.warn(`Error fetching ${token} price:`, tokenError)
          prices[token as keyof TokenPrices] = 0
        }
        
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      setTokenPrices(prices as TokenPrices)
      setLastUpdated(new Date())
      
    } catch (err) {
      setError(`Failed to fetch token prices: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const checkSubscription = async (user: string) => {
    try {
      // In a real implementation, this would query a smart contract or database
      // For now, we'll simulate checking subscription status
      const savedSub = localStorage.getItem(`subscription_${user}`)
      if (savedSub) {
        const sub: Subscription = JSON.parse(savedSub)
        const now = Math.floor(Date.now() / 1000)
        if (sub.expiresAt > now) {
          setSubscription({ ...sub, active: true })
        } else {
          setSubscription({ ...sub, active: false })
          localStorage.removeItem(`subscription_${user}`)
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const purchaseSubscription = async () => {
    if (!session) return
    
    setPaymentLoading(true)
    try {
      const action = {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [session.permissionLevel],
        data: {
          from: session.actor,
          to: SUBSCRIPTION_CONFIG.recipient,
          quantity: SUBSCRIPTION_CONFIG.price,
          memo: `Premium subscription for ${session.actor}`,
        },
      }

      const result = await session.transact({ action })
      
      if (result) {
        // Save subscription locally (in production, this would be handled by smart contract)
        const expiresAt = Math.floor(Date.now() / 1000) + SUBSCRIPTION_CONFIG.duration
        const newSub: Subscription = {
          user: session.actor.toString(),
          expiresAt,
          active: true
        }
        
        localStorage.setItem(`subscription_${session.actor}`, JSON.stringify(newSub))
        setSubscription(newSub)
      }
    } catch (error) {
      console.error('Payment failed:', error)
      setError('Payment failed. Please try again.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const login = async () => {
    try {
      const response = await sessionKit.login()
      setSession(response.session)
      checkSubscription(response.session.actor.toString())
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    if (session) {
      sessionKit.logout(session)
      setSession(undefined)
      setSubscription(null)
    }
  }

  const parseTokenAmount = (tokenString: string) => {
    const match = tokenString.match(/([0-9.]+)\s+([A-Z]+)/)
    if (match) {
      return {
        amount: parseFloat(match[1]),
        token: match[2]
      }
    }
    return { amount: 0, token: '' }
  }

  const calculateToolMetrics = (tool: typeof nftConfigs[0]) => {
    const energyPerMine = tool.consumed.first
    const durabilityPerMine = tool.consumed.second
    const cooldownHours = tool.charged_time / 3600
    const maxDurability = tool.max_durability
    
    const energyCostFARM = energyPerMine / 5
    const durabilityToolCost = durabilityPerMine / 5
    
    const energyCostUSD = energyCostFARM * tokenPrices.FARM
    const durabilityUSDCost = durabilityToolCost * tokenPrices.TOOL
    const totalCostPerMine = energyCostUSD + durabilityUSDCost
    
    const rewardData = parseTokenAmount(tool.rewards[0])
    const rewardUSD = rewardData.amount * tokenPrices[rewardData.token as keyof TokenPrices]
    
    const netProfitPerMine = rewardUSD - totalCostPerMine
    const totalMinesBeforeBreak = Math.floor(maxDurability / durabilityPerMine)
    const maxDailyMines = Math.floor(24 / cooldownHours)
    const daysUntilBreak = totalMinesBeforeBreak / maxDailyMines
    const actualDailyMines = daysUntilBreak >= 1 ? maxDailyMines : totalMinesBeforeBreak
    
    const dailyProfit = netProfitPerMine * actualDailyMines
    const weeklyProfit = dailyProfit * 7
    const monthlyProfit = dailyProfit * 30
    
    const craftingCosts = tool.mints.map(parseTokenAmount)
    const totalCraftingCostUSD = craftingCosts.reduce((sum, cost) => {
      return sum + (cost.amount * tokenPrices[cost.token as keyof TokenPrices])
    }, 0)
    
    const dailyROI = dailyProfit > 0 ? (dailyProfit / totalCraftingCostUSD) * 100 : 0
    const paybackDays = dailyProfit > 0 ? totalCraftingCostUSD / dailyProfit : Infinity
    
    return {
      energyCostFARM,
      durabilityToolCost,
      totalCostPerMine,
      rewardUSD,
      netProfitPerMine,
      dailyProfit,
      weeklyProfit,
      monthlyProfit,
      totalCraftingCostUSD,
      dailyROI,
      paybackDays,
      actualDailyMines,
      totalMinesBeforeBreak,
      daysUntilBreak,
      craftingCosts
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'basic': return 'text-gray-600 bg-gray-100'
      case 'common': return 'text-green-600 bg-green-100'
      case 'uncommon': return 'text-blue-600 bg-blue-100'
      case 'rare': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ranch': return '🐄'
      case 'farm': return '🌾'
      case 'tool': return '🔧'
      default: return '⚡'
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount === Infinity || isNaN(amount)) return 'N/A'
    return `$${amount.toFixed(4)}`
  }

  const formatDays = (days: number) => {
    if (days === Infinity || isNaN(days)) return 'Never'
    if (days < 1) return `${Math.round(days * 24)} hours`
    if (days < 30) return `${Math.round(days)} days`
    return `${Math.round(days / 30)} months`
  }

  const exportData = () => {
    if (!subscription?.active) return
    
    const data = nftConfigs.map(tool => {
      const metrics = calculateToolMetrics(tool)
      return {
        name: tool.nft_name,
        type: tool.type,
        rarity: tool.rarity,
        dailyProfit: metrics.dailyProfit,
        weeklyProfit: metrics.weeklyProfit,
        monthlyProfit: metrics.monthlyProfit,
        roi: metrics.dailyROI,
        paybackDays: metrics.paybackDays,
        craftingCost: metrics.totalCraftingCostUSD
      }
    })
    
    const csv = [
      'Tool,Type,Rarity,Daily Profit,Weekly Profit,Monthly Profit,ROI %,Payback Days,Crafting Cost',
      ...data.map(row => 
        `${row.name},${row.type},${row.rarity},${row.dailyProfit.toFixed(4)},${row.weeklyProfit.toFixed(4)},${row.monthlyProfit.toFixed(4)},${row.roi.toFixed(2)},${row.paybackDays === Infinity ? 'Never' : row.paybackDays.toFixed(0)},${row.craftingCost.toFixed(4)}`
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ranchers-roi-analysis.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const isPremium = subscription?.active || false

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Crown className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">🚜 Ranchers ROI Premium</h1>
            <p className="text-gray-600 mb-6">Connect your WAX wallet to access professional ROI analysis tools</p>
            
            <button 
              onClick={login}
              className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </button>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Premium features include:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Advanced ROI analytics</li>
                <li>Data export capabilities</li>
                <li>Real-time price alerts</li>
                <li>Portfolio optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Crown className="h-8 w-8 text-yellow-500" />
                Ranchers ROI Premium
              </h1>
              <p className="text-gray-600">Connected as: {session?.actor.toString()}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {isPremium ? (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Premium Active</span>
                  <span className="text-sm">
                    (expires {new Date(subscription!.expiresAt * 1000).toLocaleDateString()})
                  </span>
                </div>
              ) : (
                <button
                  onClick={purchaseSubscription}
                  disabled={paymentLoading}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  {paymentLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Crown className="h-5 w-5" />
                  )}
                  {paymentLoading ? 'Processing...' : `Upgrade to Premium - ${SUBSCRIPTION_CONFIG.price}`}
                </button>
              )}
              
              <button 
                onClick={logout}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Token Prices */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Token Prices</h3>
            <div className="flex gap-2">
              {isPremium && (
                <button 
                  onClick={exportData}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              )}
              <button 
                onClick={fetchTokenPrices}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(tokenPrices).map(([token, price]) => (
              <div key={token} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{token}</div>
                <div className={`text-lg ${price > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(price)}
                </div>
                {price === 0 && (
                  <div className="text-xs text-red-500 mt-1">No data</div>
                )}
              </div>
            ))}
          </div>
          
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {nftConfigs.map((tool, index) => {
            const metrics = calculateToolMetrics(tool)
            const showPremiumFeatures = isPremium || index < 3 // Show first 3 for free users
            
            return (
              <div key={tool.template_id} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${!showPremiumFeatures ? 'opacity-60 relative' : ''}`}>
                {!showPremiumFeatures && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg p-4 text-center shadow-lg">
                      <Lock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-800 font-semibold">Premium Feature</p>
                      <p className="text-sm text-gray-600">Upgrade to view all tools</p>
                    </div>
                  </div>
                )}
                
                {/* Tool Header */}
                <div className="bg-gradient-to-r from-green-600 to-yellow-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(tool.type)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{tool.nft_name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(tool.rarity)}`}>
                          {tool.rarity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white opacity-80 text-sm">{tool.type}</div>
                      <div className="text-white font-bold">#{tool.template_id}</div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="p-6">
                  {/* Profitability */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Profitability
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Daily Profit</div>
                        <div className={`text-lg font-bold ${metrics.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(metrics.dailyProfit)}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Daily ROI</div>
                        <div className={`text-lg font-bold ${metrics.dailyROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metrics.dailyROI.toFixed(2)}%
                        </div>
                      </div>
                      {isPremium && (
                        <>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Weekly</div>
                            <div className={`text-lg font-bold ${metrics.weeklyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(metrics.weeklyProfit)}
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Monthly</div>
                            <div className={`text-lg font-bold ${metrics.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(metrics.monthlyProfit)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mining Stats */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Mining Stats
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mines per day:</span>
                        <span className="font-medium">{metrics.actualDailyMines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit per mine:</span>
                        <span className={`font-medium ${metrics.netProfitPerMine >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(metrics.netProfitPerMine)}
                        </span>
                      </div>
                      {isPremium && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tool lifetime:</span>
                          <span className="font-medium">{formatDays(metrics.daysUntilBreak)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Investment Analysis - Premium Only */}
                  {isPremium && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-blue-600" />
                        Investment
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Crafting cost:</span>
                          <span className="font-medium">{formatCurrency(metrics.totalCraftingCostUSD)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payback period:</span>
                          <span className="font-medium">{formatDays(metrics.paybackDays)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Crafting Requirements */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-gray-600" />
                      Crafting Cost
                    </h4>
                    <div className="space-y-1 text-sm">
                      {metrics.craftingCosts.map((cost, costIndex) => (
                        <div key={costIndex} className="flex justify-between">
                          <span className="text-gray-600">{cost.amount} {cost.token}:</span>
                          <span className="font-medium">{formatCurrency(cost.amount * tokenPrices[cost.token as keyof TokenPrices])}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Premium Upgrade CTA for Free Users */}
        {!isPremium && (
          <div className="mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg p-8 text-white text-center">
            <Crown className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Unlock Premium Features</h2>
            <p className="text-xl mb-6">Get access to advanced analytics, data export, and all tools</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">Advanced Analytics</h3>
                  <p className="text-sm opacity-90">Detailed ROI breakdowns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">Data Export</h3>
                  <p className="text-sm opacity-90">CSV exports for analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">All Tools</h3>
                  <p className="text-sm opacity-90">Access to complete tool list</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={purchaseSubscription}
              disabled={paymentLoading}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-3 mx-auto"
            >
              {paymentLoading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <Crown className="h-6 w-6" />
              )}
              {paymentLoading ? 'Processing Payment...' : `Upgrade Now - ${SUBSCRIPTION_CONFIG.price}`}
            </button>
            
            <p className="text-sm mt-4 opacity-90">30-day premium access • Cancel anytime</p>
          </div>
        )}

        {/* Portfolio Summary - Premium Feature */}
        {isPremium && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Portfolio Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {nftConfigs.filter(tool => calculateToolMetrics(tool).dailyProfit > 0).length}
                </div>
                <div className="text-sm text-gray-600">Profitable Tools</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(nftConfigs.reduce((sum, tool) => sum + calculateToolMetrics(tool).dailyProfit, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Daily Profit</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(nftConfigs.reduce((sum, tool) => sum + calculateToolMetrics(tool).totalCraftingCostUSD, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Investment</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {(() => {
                    const totalProfit = nftConfigs.reduce((sum, tool) => sum + calculateToolMetrics(tool).dailyProfit, 0)
                    const totalCost = nftConfigs.reduce((sum, tool) => sum + calculateToolMetrics(tool).totalCraftingCostUSD, 0)
                    return totalProfit > 0 ? `${((totalProfit / totalCost) * 100).toFixed(2)}%` : '0%'
                  })()}
                </div>
                <div className="text-sm text-gray-600">Portfolio ROI</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Data sourced from Alcor Exchange API • Updates every 5 minutes</p>
          <p className="mt-1">Energy cost: 5 energy = 1 FARM • Durability cost: 5 durability = 1 TOOL</p>
        </div>
      </div>
    </div>
  )
}

export default App
