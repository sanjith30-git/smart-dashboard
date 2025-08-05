import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <main className="bg-gradient-to-br from-blue-200 to-green-200 min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-700">Smart Control Panel</h1>
      <Dashboard />
    </main>
  );
}