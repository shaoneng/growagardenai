// Enhanced Game Guide Section Content Components
import React from 'react';
import { 
  Sprout, 
  Coins, 
  Zap, 
  TrendingUp, 
  Users, 
  Map,
  Star,
  Crown,
  Snowflake,
  Rainbow,
  Cloud,
  Sun,
  CloudRain,
  Zap as Lightning,
  Heart,
  Gift,
  ShoppingCart,
  Calendar,
  Trophy,
  Target,
  Clock,
  BarChart3
} from 'lucide-react';
import { GuideSection } from './enhanced-game-guide-types';
import { viralStatistics, gameMechanics, strategyPhases } from './enhanced-game-guide-content';

// Section 1: Welcome & Game Popularity
const WelcomeSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="text-6xl mb-4">🌱</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to Grow a Garden!
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        The viral Roblox farming sensation that's captured millions of players worldwide
      </p>
    </div>

    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-8 h-8 text-green-600" />
        <h3 className="text-2xl font-bold text-gray-800">Viral Gaming Phenomenon</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {viralStatistics.peakConcurrentPlayers.toLocaleString()}+
          </div>
          <p className="text-gray-700">Peak concurrent players - even surpassing Fortnite at times!</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            "{viralStatistics.culturalPositioning}"
          </div>
          <p className="text-gray-700">How gaming media describes this cultural phenomenon</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-purple-50 p-4 rounded-lg text-center">
        <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <h4 className="font-semibold text-purple-800 mb-2">Stress-Free Gaming</h4>
        <p className="text-sm text-purple-700">
          Healing gameplay that provides emotional comfort between intense games
        </p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg text-center">
        <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <h4 className="font-semibold text-orange-800 mb-2">Global Community</h4>
        <p className="text-sm text-orange-700">
          Millions of players sharing, trading, and building together
        </p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <h4 className="font-semibold text-green-800 mb-2">Idle-Friendly</h4>
        <p className="text-sm text-green-700">
          Crops continue growing even when you're offline
        </p>
      </div>
    </div>

    <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
      <h4 className="font-bold text-yellow-800 mb-2">🎯 Why It's So Popular</h4>
      <p className="text-yellow-700">
        Grow a Garden combines the satisfaction of progression with relaxing gameplay, 
        creating the perfect balance for players seeking both achievement and tranquility. 
        Its viral success stems from being accessible to newcomers while offering deep 
        strategic elements for dedicated players.
      </p>
    </div>
  </div>
);

// Section 2: Core Gameplay Loop
const CoreGameplaySection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Coins className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Core Gameplay Loop</h2>
      <p className="text-gray-600">Master the fundamental cycle that drives everything</p>
    </div>

    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <Coins className="w-6 h-6 text-yellow-600" />
        <h3 className="text-xl font-semibold text-gray-800">Starting Resources</h3>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-3xl font-bold text-yellow-600">20</div>
          <div>
            <div className="font-semibold text-gray-800">Sheckles</div>
            <div className="text-sm text-gray-600">Your starting capital</div>
          </div>
        </div>
        <p className="text-gray-700">
          Every player begins with 20 Sheckles - enough to buy your first carrot seeds 
          and start your farming empire. This isn't much, but with smart reinvestment, 
          it's all you need to build a thriving operation.
        </p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">The Five-Step Success Cycle</h3>
      <div className="space-y-4">
        {[
          { step: 1, icon: ShoppingCart, title: 'Buy Seeds', desc: 'Purchase seeds with your Sheckles', color: 'blue' },
          { step: 2, icon: Sprout, title: 'Plant Crops', desc: 'Place seeds in your farming plots', color: 'green' },
          { step: 3, icon: Clock, title: 'Wait & Grow', desc: 'Crops mature over time (even offline!)', color: 'purple' },
          { step: 4, icon: Trophy, title: 'Harvest', desc: 'Collect mature crops and rare mutations', color: 'orange' },
          { step: 5, icon: Coins, title: 'Sell & Reinvest', desc: 'Convert crops to Sheckles and expand', color: 'yellow' }
        ].map(({ step, icon: Icon, title, desc, color }) => (
          <div key={step} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{step}. {title}</div>
              <div className="text-sm text-gray-600">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">✅ Beginner-Friendly Design</h4>
        <p className="text-green-700 text-sm">
          The interface is intuitive and easy to learn, perfect for players of all ages 
          to jump right in without complex tutorials or overwhelming mechanics.
        </p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">🔄 Continuous Progress</h4>
        <p className="text-purple-700 text-sm">
          Your crops continue growing even when you're offline, making this perfect 
          for busy players who want steady progress without constant attention.
        </p>
      </div>
    </div>
  </div>
);

// Section 3: Advanced Mechanics
const AdvancedMechanicsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Advanced Mechanics</h2>
      <p className="text-gray-600">Unlock the strategic depth that separates pros from beginners</p>
    </div>

    {/* Mutations System */}
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <Star className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-800">Crop Mutations</h3>
      </div>
      <p className="text-gray-700 mb-4">
        When you harvest crops, there's a chance they'll "mutate" into rare variants 
        worth significantly more Sheckles than regular crops.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: 'Golden', icon: Crown, color: 'yellow', value: '5-10x' },
          { name: 'Rainbow', icon: Rainbow, color: 'pink', value: '8-15x' },
          { name: 'Frozen', icon: Snowflake, color: 'blue', value: '6-12x' },
          { name: 'Lightning', icon: Lightning, color: 'purple', value: '10-20x' }
        ].map(({ name, icon: Icon, color, value }) => (
          <div key={name} className={`bg-${color}-50 p-3 rounded-lg text-center border border-${color}-200`}>
            <Icon className={`w-6 h-6 text-${color}-600 mx-auto mb-1`} />
            <div className={`font-semibold text-${color}-800 text-sm`}>{name}</div>
            <div className={`text-xs text-${color}-600`}>{value} value</div>
          </div>
        ))}
      </div>
    </div>

    {/* Weather System */}
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <Cloud className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Weather System</h3>
      </div>
      <p className="text-gray-700 mb-4">
        Different weather conditions trigger specific mutation types. Master the weather 
        patterns to maximize your rare crop production.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { weather: 'Sunny', icon: Sun, mutations: ['Golden', 'Radiant'], color: 'yellow' },
          { weather: 'Rainy', icon: CloudRain, mutations: ['Rainbow', 'Prismatic'], color: 'blue' },
          { weather: 'Stormy', icon: Lightning, mutations: ['Lightning', 'Electric'], color: 'purple' }
        ].map(({ weather, icon: Icon, mutations, color }) => (
          <div key={weather} className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 text-${color}-600`} />
              <span className={`font-semibold text-${color}-800`}>{weather}</span>
            </div>
            <div className="text-sm text-gray-600">
              Triggers: {mutations.join(', ')} mutations
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Sprinklers and Pets */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Sprinkler Systems</h3>
        </div>
        <p className="text-gray-700 mb-3">
          Automated watering systems that accelerate crop growth and significantly 
          increase mutation chances.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">2x faster growth speed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">+50% mutation probability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Covers 3x3 area per sprinkler</span>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Pet Companions</h3>
        </div>
        <p className="text-gray-700 mb-3">
          Adorable companions that provide passive bonuses to your farming operation. 
          Acquired through loot boxes.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Growth speed bonuses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Profit multipliers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Specialized mutation bonuses</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Section 4: Progression & Updates
const ProgressionSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Progression & Updates</h2>
      <p className="text-gray-600">Scale your operation and master new content</p>
    </div>

    {/* Land Expansion */}
    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <Map className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-800">Land Expansion</h3>
      </div>
      <p className="text-gray-700 mb-4">
        As you earn more Sheckles, unlock larger plots and purchase premium seeds and tools 
        to scale your farming empire.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { size: 'Small Plot', cost: '100 Sheckles', capacity: '9 crops' },
          { size: 'Medium Plot', cost: '500 Sheckles', capacity: '25 crops' },
          { size: 'Large Plot', cost: '2000 Sheckles', capacity: '64 crops' }
        ].map(({ size, cost, capacity }) => (
          <div key={size} className="bg-white p-4 rounded-lg border border-green-200">
            <div className="font-semibold text-gray-800 mb-1">{size}</div>
            <div className="text-sm text-gray-600 mb-1">{cost}</div>
            <div className="text-xs text-green-600">{capacity}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Weekly Events */}
    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-800">Weekly Events</h3>
      </div>
      <p className="text-gray-700 mb-4">
        Limited-time seeds, decorations, and special items appear weekly. 
        Participate actively to collect exclusive content!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">🌟 Exclusive Seeds</h4>
          <p className="text-sm text-gray-600">
            Special crop varieties only available during events, often with unique mutations
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">🎨 Limited Decorations</h4>
          <p className="text-sm text-gray-600">
            Cosmetic items to personalize your farm and show off your achievements
          </p>
        </div>
      </div>
    </div>

    {/* Kitchen Storm Update */}
    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-semibold text-gray-800">Kitchen Storm Update</h3>
      </div>
      <p className="text-gray-700 mb-4">
        The pasta cooking system adds recipes and new strategic gameplay elements, 
        allowing you to process crops into high-value dishes.
      </p>
      <div className="bg-white p-4 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-2">🍝 Recipe Mastery</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div>• Learn pasta recipes that use your harvested crops as ingredients</div>
          <div>• Some recipes require specific mutation variants</div>
          <div>• Cooked dishes often sell for more than raw crops</div>
          <div>• Master timing for optimal cooking results</div>
        </div>
      </div>
    </div>
  </div>
);

// Section 5: Social Features
const SocialFeaturesSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Community & Social Features</h2>
      <p className="text-gray-600">Connect, trade, and grow together with millions of players</p>
    </div>

    {/* Gift System */}
    <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-pink-600" />
        <h3 className="text-xl font-semibold text-gray-800">Gift System</h3>
      </div>
      <p className="text-gray-700 mb-4">
        Share rare crops with friends and build your community network. 
        Generosity often comes back in unexpected ways!
      </p>
      <div className="bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-pink-800 mb-2">💝 Giving Benefits</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• Strengthen friendships and community ties</div>
              <div>• Receive gifts in return from grateful players</div>
              <div>• Build reputation as a generous community member</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-pink-800 mb-2">🎁 Receiving Rewards</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• Get rare crops you haven't unlocked yet</div>
              <div>• Access to exclusive community-only items</div>
              <div>• Learn new strategies from experienced players</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Trading System */}
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <ShoppingCart className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Trading Marketplace</h3>
      </div>
      <p className="text-gray-700 mb-4">
        Active marketplace for exchanging valuable items and mutations with other players worldwide.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">🌟</div>
          <h4 className="font-semibold text-blue-800 mb-1">Rare Mutations</h4>
          <p className="text-xs text-gray-600">Trade exclusive crop variants</p>
        </div>
        <div className="bg-white p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">🐾</div>
          <h4 className="font-semibold text-blue-800 mb-1">Premium Pets</h4>
          <p className="text-xs text-gray-600">Exchange companion animals</p>
        </div>
        <div className="bg-white p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">🎨</div>
          <h4 className="font-semibold text-blue-800 mb-1">Limited Items</h4>
          <p className="text-xs text-gray-600">Swap event-exclusive content</p>
        </div>
      </div>
    </div>

    {/* Why It's Popular */}
    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-800">Why It Became a Phenomenon</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-green-800 mb-2">😌 Emotional Comfort</h4>
          <p className="text-sm text-gray-600 mb-3">
            The idle mechanics and healing gameplay provide stress relief, making it perfect 
            for relaxation between more intense gaming sessions.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-green-800 mb-2">🌍 Global Appeal</h4>
          <p className="text-sm text-gray-600 mb-3">
            Simple mechanics with deep strategy appeal to players of all ages and backgrounds, 
            creating a truly inclusive gaming community.
          </p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">21,000,000+</div>
          <div className="text-sm text-gray-600">Peak concurrent players achieved</div>
          <div className="text-xs text-gray-500 mt-1">Often surpassing major titles like Fortnite</div>
        </div>
      </div>
    </div>
  </div>
);

// Section 6: Strategic Roadmap
const StrategyRoadmapSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Target className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Strategic Roadmap</h2>
      <p className="text-gray-600">Your path from beginner to farming master</p>
    </div>

    <div className="space-y-6">
      {strategyPhases.map((phase, index) => {
        const colors = {
          early: 'yellow',
          mid: 'blue', 
          late: 'purple',
          ongoing: 'green'
        };
        const color = colors[phase.phase];
        
        return (
          <div key={phase.phase} className={`bg-${color}-50 p-6 rounded-xl border border-${color}-200`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 bg-${color}-500 text-white rounded-full flex items-center justify-center font-bold`}>
                {index + 1}
              </div>
              <div>
                <h3 className={`text-xl font-semibold text-${color}-800`}>{phase.title}</h3>
                <p className={`text-sm text-${color}-600`}>{phase.timeframe}</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{phase.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className={`font-semibold text-${color}-800 mb-2`}>🎯 Key Actions</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {phase.keyActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 bg-${color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className={`font-semibold text-${color}-800 mb-2`}>📈 Expected Outcomes</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {phase.expectedOutcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 bg-${color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-white p-3 rounded-lg">
              <h4 className={`font-semibold text-${color}-800 mb-1 text-sm`}>🛠️ Recommended Resources</h4>
              <div className="flex flex-wrap gap-2">
                {phase.recommendedResources.map((resource, i) => (
                  <span key={i} className={`px-2 py-1 bg-${color}-100 text-${color}-700 rounded text-xs`}>
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
      <div className="text-center">
        <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Success Metrics</h3>
        <p className="text-gray-600 mb-4">
          Track your progress with these key indicators of farming mastery
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: 'Sheckles/Hour', target: '1000+', icon: '💰' },
            { metric: 'Mutation Rate', target: '25%+', icon: '✨' },
            { metric: 'Active Pets', target: '5+', icon: '🐾' },
            { metric: 'Land Plots', target: '10+', icon: '🌍' }
          ].map(({ metric, target, icon }) => (
            <div key={metric} className="bg-white p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{metric}</div>
              <div className="text-indigo-600 text-xs">{target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Export all sections
export const guideSections: GuideSection[] = [
  {
    id: 'welcome',
    title: 'Welcome to Grow a Garden! 🌱',
    icon: <Sprout className="w-8 h-8 text-green-500" />,
    content: <WelcomeSection />,
    estimatedReadTime: 3,
    keyTopics: ['Viral phenomenon', 'Cultural impact', 'Game appeal', 'Community size']
  },
  {
    id: 'core-gameplay',
    title: 'Core Gameplay Loop 🔄',
    icon: <Coins className="w-8 h-8 text-yellow-500" />,
    content: <CoreGameplaySection />,
    estimatedReadTime: 4,
    keyTopics: ['Starting resources', 'Basic cycle', 'Sheckles', 'Beginner strategy']
  },
  {
    id: 'advanced-mechanics',
    title: 'Advanced Mechanics ⚡',
    icon: <Zap className="w-8 h-8 text-purple-500" />,
    content: <AdvancedMechanicsSection />,
    estimatedReadTime: 6,
    keyTopics: ['Mutations', 'Weather system', 'Sprinklers', 'Pets', 'Loot boxes']
  },
  {
    id: 'progression',
    title: 'Progression & Updates 📈',
    icon: <TrendingUp className="w-8 h-8 text-green-500" />,
    content: <ProgressionSection />,
    estimatedReadTime: 5,
    keyTopics: ['Land expansion', 'Weekly events', 'Kitchen Storm', 'Premium content']
  },
  {
    id: 'social-features',
    title: 'Community & Social 👥',
    icon: <Users className="w-8 h-8 text-blue-500" />,
    content: <SocialFeaturesSection />,
    estimatedReadTime: 4,
    keyTopics: ['Gift system', 'Trading', 'Community benefits', 'Viral appeal']
  },
  {
    id: 'strategy-roadmap',
    title: 'Strategic Roadmap 🎯',
    icon: <Target className="w-8 h-8 text-indigo-500" />,
    content: <StrategyRoadmapSection />,
    estimatedReadTime: 7,
    keyTopics: ['Phase progression', 'Resource management', 'Success metrics', 'Long-term goals']
  }
];