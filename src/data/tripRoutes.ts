export type RouteMode = "flight" | "bus" | "drive";

export interface RouteInfo {
  mode: RouteMode;
  time: string;
  cost: string;
}

export const ROUTE_DATA: Record<string, RouteInfo> = {
  "ktm-pok": { mode: "flight", time: "25 min",  cost: "$100–150" },
  "ktm-chi": { mode: "bus",    time: "5 hr",    cost: "$8–15"    },
  "ktm-lum": { mode: "bus",    time: "6 hr",    cost: "$10–18"   },
  "ktm-bha": { mode: "drive",  time: "30 min",  cost: "$5–10"    },
  "ktm-ana": { mode: "flight", time: "35 min",  cost: "$120–180" },
  "ktm-mus": { mode: "flight", time: "1 hr",    cost: "$150–220" },
  "ktm-rar": { mode: "flight", time: "45 min",  cost: "$130–200" },
  "pok-chi": { mode: "bus",    time: "5 hr",    cost: "$8–15"    },
  "pok-ana": { mode: "drive",  time: "4 hr",    cost: "$20–40"   },
  "pok-mus": { mode: "drive",  time: "5 hr",    cost: "$25–50"   },
  "chi-lum": { mode: "bus",    time: "3 hr",    cost: "$6–12"    },
  "bha-pok": { mode: "bus",    time: "6 hr",    cost: "$8–15"    },
};

export function getRoute(a: string, b: string): RouteInfo {
  return (
    ROUTE_DATA[`${a}-${b}`] ??
    ROUTE_DATA[`${b}-${a}`] ??
    { mode: "bus", time: "varies", cost: "varies" }
  );
}

export const ROUTE_COLORS: Record<RouteMode, string> = {
  flight: "#0EA5E9",
  bus:    "#F97316",
  drive:  "#84CC16",
};

export const ROUTE_LABELS: Record<RouteMode, string> = {
  flight: "Fly",
  bus:    "Bus",
  drive:  "Drive",
};
