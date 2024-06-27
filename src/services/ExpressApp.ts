import express, { Application } from "express";
import { join } from "path";
import {
  adminRoute,
  customerRoute,
  shoppingRoute,
  vendorRoute,
} from "../routes";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/images", express.static(join(__dirname, "images")));

  app.use("/admin", adminRoute);
  app.use("/vendor", vendorRoute);
  app.use("/customer", customerRoute);
  app.use("/shopping", shoppingRoute);

  return app;
};



