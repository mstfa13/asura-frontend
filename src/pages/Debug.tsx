import { useActivityStore } from '@/lib/activityStore';

export default function Debug() {
  const store = useActivityStore();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Store Data</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Boxing Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(store.boxing, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Gym Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(store.gym, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Fitness Test Trend Length:</h2>
          <p>{store.boxing.fitnessTestTrend?.length || 0}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Boxing Tape Trend Length:</h2>
          <p>{store.boxing.boxingTapeTrend?.length || 0}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Gym Weight Trend Length:</h2>
          <p>{store.gym.weightTrend?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
