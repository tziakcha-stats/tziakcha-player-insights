interface ReviewerDebugApi {
  isEnabled: () => boolean;
  setEnabled: (enabled: boolean) => boolean;
}

interface History {
  __reviewer_route_hooked?: boolean;
}

interface Window {
  __reviewerDebug?: ReviewerDebugApi;
}
