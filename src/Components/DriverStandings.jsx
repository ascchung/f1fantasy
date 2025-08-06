import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { mockDrivers } from "../mockData";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/f1-points"
    : process.env.REACT_APP_API_URL;

const teamColors = {
  "Red Bull": "#1E41FF",
  Mercedes: "#00D2BE", 
  Ferrari: "#DC0000",
  McLaren: "#FF8700",
  "Aston Martin": "#006F62",
  Alpine: "#0090FF",
  Williams: "#005AFF",
  "Kick Sauber": "#52E252",
  RB: "#6692FF",
  Haas: "#B6BABD",
};

const DriverCard = ({ driver, index }) => {
  const [flipped, setFlipped] = useState(false);
  const teamColor = teamColors[driver.Team] || "#8884d8";
  
  const momentum = Math.random() > 0.5 ? 'up' : 'down';
  const momentumIcon = momentum === 'up' ? '📈' : '📉';
  const momentumColor = momentum === 'up' ? 'text-green-400' : 'text-red-400';
  
  return (
    <div 
      className="perspective-1000 w-full h-32 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute inset-0 backface-hidden rounded-lg shadow-lg" 
             style={{ background: `linear-gradient(135deg, ${teamColor}20, ${teamColor}40)` }}>
          <div className="p-4 h-full flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">P{index + 1}</span>
              <div>
                <div className="font-bold text-lg">{driver.Driver}</div>
                <div className="text-sm opacity-80">{driver.Team}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">{driver["Race Points"]}</div>
              <div className="text-xs opacity-80">points</div>
              <div className={`text-lg ${momentumColor}`}>{momentumIcon}</div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg shadow-lg bg-gray-800">
          <div className="p-4 h-full flex flex-col justify-center text-white text-center">
            <div className="text-sm opacity-80 mb-2">Driver Stats</div>
            <div className="space-y-1">
              <div className="text-xs">Podiums: {Math.floor(Math.random() * 5)}</div>
              <div className="text-xs">Fastest Laps: {Math.floor(Math.random() * 3)}</div>
              <div className="text-xs">DNFs: {Math.floor(Math.random() * 2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white text-center shadow-2xl">
      <h3 className="text-2xl font-bold mb-4 animate-pulse">🏁 Next Race Countdown 🏁</h3>
      <div className="flex justify-center space-x-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="bg-black bg-opacity-50 rounded-lg p-3 min-w-16">
            <div className="text-3xl font-mono font-bold text-yellow-400">{value.toString().padStart(2, '0')}</div>
            <div className="text-xs uppercase">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DriverChart() {
  const [drivers, setDrivers] = useState([]);
  const [barData, setBarData] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        if (process.env.NODE_ENV === "development") {
          // Use mock data in development
          setDrivers(mockDrivers.data);
          return;
        }
        
        const res = await fetch(`${BASE_URL}/drivers`);
        const json = await res.json();
        setDrivers(json.data);
      } catch (err) {
        console.error("Error fetching drivers", err);
        // Fallback to mock data on error
        setDrivers(mockDrivers.data);
      }
    }
    fetchDrivers();
  }, []);

  useEffect(() => {
    const data = drivers.map((d) => ({
      driver: d.Driver,
      points: parseFloat(d["Race Points"]) || 0,
      fill: teamColors[d.Team] || "#8884d8",
      team: d.Team
    }));
    setBarData(data);
  }, [drivers]);

  const sorted = [...drivers].sort(
    (a, b) => parseFloat(b["Race Points"]) - parseFloat(a["Race Points"])
  );

  const radarData = selectedDrivers.slice(0, 2).map(driver => ({
    name: driver.Driver,
    speed: Math.floor(Math.random() * 100),
    consistency: Math.floor(Math.random() * 100),
    racecraft: Math.floor(Math.random() * 100), 
    qualifying: Math.floor(Math.random() * 100),
    points: parseFloat(driver["Race Points"]) || 0
  }));

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gradient-to-br from-gray-900 via-black to-blue-900 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-2 text-white bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
          🏎️ Driver Championship 🏎️
        </h2>
        <p className="text-xl text-gray-300">2025 Season Standings</p>
      </div>

      <div className="mb-8">
        <CountdownTimer />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-6">🏆 Championship Standings</h3>
          <div className="space-y-3">
            {sorted.map((driver, index) => (
              <div 
                key={`drv-${driver.Driver}`}
                onClick={() => {
                  if (selectedDrivers.includes(driver)) {
                    setSelectedDrivers(selectedDrivers.filter(d => d !== driver));
                  } else if (selectedDrivers.length < 2) {
                    setSelectedDrivers([...selectedDrivers, driver]);
                  }
                }}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedDrivers.includes(driver) ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <DriverCard driver={driver} index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 Points Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData.slice(0, 10)}>
                <XAxis 
                  dataKey="driver" 
                  tick={{ fill: "white", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="points">
                  {barData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {selectedDrivers.length === 2 && (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">⚡ Head-to-Head Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis tick={{ fill: "white", fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: "white", fontSize: 10 }} />
                  <Radar
                    name={selectedDrivers[0].Driver}
                    dataKey="speed"
                    stroke="#ff6b6b"
                    fill="#ff6b6b"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name={selectedDrivers[1].Driver}
                    dataKey="consistency" 
                    stroke="#4ecdc4"
                    fill="#4ecdc4"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
