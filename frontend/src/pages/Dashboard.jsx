import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

export default function Dashboard(){
  const [metrics,setMetrics]=useState(null);
  useEffect(()=> {
    const token = localStorage.getItem("token");
    axios.get("/api/admin/metrics", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMetrics(res.data))
      .catch(()=>{/* ignore */});
  }, []);
  if (!metrics) return <div><h3>Admin Dashboard</h3><p>Metrics loading (login as admin to see real data)</p></div>;

  const data = {
    labels: ["6d","5d","4d","3d","2d","1d","today"],
    datasets: [{ label: "Visits", data: metrics.traffic.last7days, backgroundColor: "rgba(54,162,235,0.5)" }]
  };

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3">Posts: {metrics.postsCount}</div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">Users: {metrics.usersCount}</div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">Projects: {metrics.projectsCount}</div>
        </div>
      </div>

      <div className="mt-4">
        <Bar data={data} />
      </div>
    </div>
  );
}
