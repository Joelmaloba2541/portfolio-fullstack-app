import React from "react";

export default function Profile(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <div>Please login to see profile</div>;
  return (
    <div>
      <h3>Profile</h3>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}
