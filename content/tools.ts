// Illustrative nominal annual assumptions, not measured or forecast returns.
export const dcaDefaults = {
  starting: 10000,
  monthly: 500,
  age: 30,
  targetAge: 65,
  inflation: 4,
};
export const dcaAssets = [
  { id: "equities", label: "S&P 500", rate: 10.5, color: "#f3f3f3" },
  { id: "gold", label: "Gold", rate: 8.2, color: "#bca577" },
  { id: "cash", label: "Bank cash", rate: 0, color: "#777c85" },
];
