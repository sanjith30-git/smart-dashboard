import { useEffect, useState } from "react";

const relays = [
  { id: 1, label: "Water Pump" },
  { id: 2, label: "Air Pump" },
  { id: 3, label: "Light 1" },
  { id: 4, label: "Light 2" },
];

export default function Dashboard() {
  const [sensor, setSensor] = useState({ temp: 0, humidity: 0 });
  const [relayStates, setRelayStates] = useState([false, false, false, false]);
  const [timers, setTimers] = useState(["", "", "", ""]);

  useEffect(() => {
    const fetchSensor = () => {
      fetch("http://ESP32_IP/sensor")
        .then(res => res.json())
        .then(data => setSensor({ temp: data.temp, humidity: data.humidity }));
    };
    const interval = setInterval(fetchSensor, 5000);
    fetchSensor();
    return () => clearInterval(interval);
  }, []);

  const toggleRelay = (id) => {
    const updated = [...relayStates];
    updated[id - 1] = !updated[id - 1];
    setRelayStates(updated);
    fetch(`http://ESP32_IP/relay/${id}/${updated[id - 1] ? "on" : "off"}`);
  };

  const startTimer = (id) => {
    const minutes = parseInt(timers[id - 1], 10);
    if (!isNaN(minutes)) {
      fetch(`http://ESP32_IP/relay/${id}/timer/${minutes}`);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">🌡️ Temperature & Humidity</h2>
        <p>Temperature: <strong>{sensor.temp}°C</strong></p>
        <p>Humidity: <strong>{sensor.humidity}%</strong></p>
      </div>

      {relays.map((relay, i) => (
        <div key={relay.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">{relay.label}</h2>
          <button
            className={\`px-4 py-2 rounded-full \${relayStates[i] ? "bg-red-500" : "bg-green-500"} text-white\`}
            onClick={() => toggleRelay(relay.id)}
          >
            {relayStates[i] ? "Turn OFF" : "Turn ON"}
          </button>
          <div className="mt-2">
            <input
              type="number"
              placeholder="Timer (min)"
              className="p-2 border rounded mr-2"
              value={timers[i]}
              onChange={(e) => {
                const newTimers = [...timers];
                newTimers[i] = e.target.value;
                setTimers(newTimers);
              }}
            />
            <button onClick={() => startTimer(relay.id)} className="bg-blue-500 text-white px-3 py-2 rounded">
              Set Timer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}