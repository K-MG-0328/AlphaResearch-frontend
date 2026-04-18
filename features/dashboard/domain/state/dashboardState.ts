export type DashboardState =
  | { status: "LOADING" }
  | { status: "LOADED" }
  | { status: "ERROR"; message: string };
