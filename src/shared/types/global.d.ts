interface ReviewerDebugApi {
  isEnabled: () => boolean;
  setEnabled: (enabled: boolean) => boolean;
}

interface History {
  __reviewer_route_hooked?: boolean;
}

interface Window {
  __reviewerDebug?: ReviewerDebugApi;
  __review_error?: string;
  __review_tz_instance?: unknown;
  __reviews?: Record<string, unknown>;
  __reviews_filled?: Record<string, unknown>;
  __reviews_seats?: Array<number | undefined>;
  WIND?: string[];
  TILE?: string[];
  _TZ_intercepted_direct?: boolean;
  _TZ?: unknown;
  _TZ_intercepted?: boolean;
  TZ?: {
    new (): {
      stp?: number;
      adapt?: () => void;
      fetch?: (
        id: string,
        seat: number,
        v?: string | null,
        cy?: string | null,
      ) => void;
    };
  };
}
