# 🚜 Ranchers ROI Premium

A professional subscription-based ROI analysis dashboard for Ranchers tools on the WAX blockchain. Users pay in WAX tokens to unlock premium features including advanced analytics, data export, and access to all tools.

## 🌟 Features

### Free Features
- Basic ROI calculations for first 3 tools
- Live token price tracking (FARM, RANCH, TOOL)
- Daily profit/loss analysis
- WAX wallet integration via WharfKit

### Premium Features (10 WAX/month)
- **All Tools Access**: View ROI for all 8+ Ranchers tools
- **Advanced Analytics**: Weekly/monthly profit projections
- **Investment Analysis**: Payback periods and crafting costs
- **Data Export**: Download analysis as CSV files
- **Portfolio Summary**: Complete investment overview
- **Tool Lifetime Analysis**: Durability and maintenance costs

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- WAX wallet (Anchor recommended)
- WAX tokens for premium subscription

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ranchers-roi-premium.git
cd ranchers-roi-premium

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 💳 Subscription System

The premium subscription system uses WAX blockchain payments:

- **Price**: 10.0000 WAX
- **Duration**: 30 days
- **Payment Method**: Direct WAX transfer to premium wallet
- **Verification**: Blockchain transaction verification

### Subscription Flow

1. User connects WAX wallet
2. Free users see limited tools (first 3 only)
3. Click "Upgrade to Premium" button
4. Confirm 10 WAX payment transaction
5. Premium features unlock immediately
6. Subscription tracked locally and on-chain

## 🔧 Configuration

### Subscription Settings

Edit the subscription configuration in `src/App.tsx`:

```typescript
const SUBSCRIPTION_CONFIG = {
  price: '10.0000 WAX',           // Subscription price
  duration: 30 * 24 * 60 * 60,   // 30 days in seconds
  recipient: 'rancherprem1',      // Your premium wallet
}
```

### API Configuration

The app fetches live token prices from Alcor Exchange:
- `https://alcor.exchange/api/v2/tokens/farm-ranchersbank`
- `https://alcor.exchange/api/v2/tokens/ranch-ranchersbank`
- `https://alcor.exchange/api/v2/tokens/tool-ranchersbank`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Blockchain**: WAX via WharfKit
- **Wallet**: Anchor (primary), extensible to others
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React

### Key Components
- `App.tsx`: Main application with subscription logic
- `sessionKit`: WharfKit session management
- `TokenPrices`: Live price fetching system
- `ROI Calculator`: Tool profitability analysis
- `Subscription Manager`: Payment and access control

## 📊 ROI Calculations

The dashboard calculates profitability based on:

### Costs per Mining Operation
- **Energy Cost**: 5 energy = 1 FARM token
- **Durability Cost**: 5 durability = 1 TOOL token
- **Total Cost**: (Energy × FARM price) + (Durability × TOOL price)

### Revenue per Mining Operation
- **Rewards**: Based on tool type (RANCH/FARM/TOOL tokens)
- **USD Value**: Reward amount × current token price

### Profitability Metrics
- **Net Profit per Mine**: Revenue - Costs
- **Daily Profit**: Net profit × mines per day
- **ROI %**: (Daily profit / crafting cost) × 100
- **Payback Period**: Crafting cost / daily profit

## 🔐 Security Features

- **Client-side Wallet**: Private keys never leave user's device
- **Secure Payments**: All transactions via WAX blockchain
- **Local Storage**: Subscription status cached locally
- **No Personal Data**: Only wallet addresses stored

## 📈 Business Model

### Revenue Streams
1. **Premium Subscriptions**: 10 WAX per user per month
2. **Feature Expansion**: Additional premium tiers possible
3. **White Label**: Licensing to other projects

### Monetization Strategy
- Freemium model with valuable free features
- Premium features provide significant additional value
- Monthly recurring revenue via WAX payments
- Low customer acquisition cost via organic growth

## 🛠️ Development

### Project Structure
```
src/
├── App.tsx           # Main application component
├── main.tsx          # React entry point
├── index.css         # Global styles with Tailwind
├── App.css           # Component-specific styles
└── vite-env.d.ts     # TypeScript environment types
```

### Adding New Features
1. **Free Features**: Add to main component, always visible
2. **Premium Features**: Wrap with `{isPremium && ...}` conditional
3. **Tool Analysis**: Add new tool configs to `nftConfigs` array
4. **Payment Options**: Extend `SUBSCRIPTION_CONFIG` for new tiers

### Testing
- Test wallet connection with Anchor
- Verify subscription payment flow
- Test premium feature gating
- Validate ROI calculations

## 🌐 Deployment Options

### Recommended Platforms
- **Vercel**: Automatic deployments from Git
- **Netlify**: Simple static site hosting
- **IPFS**: Decentralized hosting option
- **WAX Cloud**: WAX ecosystem integration

### Environment Variables
```bash
# Optional: Custom RPC endpoints
VITE_WAX_RPC_ENDPOINT=https://wax.greymass.com
VITE_PREMIUM_WALLET=rancherprem1
```

## 📋 TODO / Roadmap

### Phase 1 (Current)
- [x] Basic ROI calculations
- [x] WAX wallet integration
- [x] Premium subscription system
- [x] Data export functionality

### Phase 2 (Next)
- [ ] Smart contract for subscription management
- [ ] Push notifications for price alerts
- [ ] Historical price charts
- [ ] Portfolio optimization suggestions

### Phase 3 (Future)
- [ ] Mobile app version
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-game support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Open GitHub issues for bugs or feature requests  
- **Discord**: Join WAX developer community
- **Email**: support@ranchersroi.com

---

## 💡 Business Tips

### Pricing Strategy
- **10 WAX** (~$2-5 depending on market) is affordable for serious players
- **Monthly billing** creates predictable revenue
- **Free tier** allows users to see value before paying

### Marketing Channels
- WAX/NFT Discord communities
- Twitter/X crypto communities
- Ranchers official channels
- Word-of-mouth from satisfied users

### Retention Strategies
- **Continuous Updates**: Add new tools and features regularly
- **Community Feedback**: Listen to user requests
- **Data Insights**: Provide unique market insights
- **Educational Content**: Help users understand ROI concepts

**Ready to launch your premium WAX analytics  platform!** 🚀
