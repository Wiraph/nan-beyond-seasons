export type ManagementEventRecord = {
  verified: boolean;
  mode: readonly ("spectate" | "compete")[];
  season: "green" | "cool" | "hot";
};

export type ManagementEventMetrics = {
  total: number;
  verified: number;
  needsReview: number;
  compete: number;
  spectate: number;
  bySeason: Record<ManagementEventRecord["season"], number>;
};

/**
 * Derives dashboard counts from the already-published event read model.
 * It intentionally accepts data as input and never persists a management action.
 */
export function managementEventMetrics(
  events: readonly ManagementEventRecord[],
): ManagementEventMetrics {
  return events.reduce<ManagementEventMetrics>(
    (metrics, event) => {
      metrics.total += 1;
      if (event.verified) metrics.verified += 1;
      else metrics.needsReview += 1;
      if (event.mode.includes("compete")) metrics.compete += 1;
      if (event.mode.includes("spectate")) metrics.spectate += 1;
      metrics.bySeason[event.season] += 1;
      return metrics;
    },
    {
      total: 0,
      verified: 0,
      needsReview: 0,
      compete: 0,
      spectate: 0,
      bySeason: { green: 0, cool: 0, hot: 0 },
    },
  );
}
