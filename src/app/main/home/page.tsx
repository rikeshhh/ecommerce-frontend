import { publicRoutes } from "@/route/api.route";
import React from "react";

export default function PublicHome({
  routes,
}: {
  routes: typeof publicRoutes;
}) {
  return (
    <div>
      <h1>Public Home</h1>
      <p>Please log in or register</p>
      <ul>
        <li>Login: {routes.auth.login}</li>
        <li>Register: {routes.auth.register}</li>
        <li>View Products: {routes.products.getAll}</li>
      </ul>
    </div>
  );
}
