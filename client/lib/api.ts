export const submitRecycling = async (data: any) => {
  const res = await fetch("/api/recycling/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const fetchRecyclingData = async (userId: string) => {
  const res = await fetch(`/api/recycling/my-data/${userId}`);
  return res.json();
};
export const fetchMonthlyAnalytics = async (userId: string) => {
  const res = await fetch(`/api/analytics/monthly/${userId}`);
  return res.json();
};
