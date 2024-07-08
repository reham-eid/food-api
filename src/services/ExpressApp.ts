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

  const imagePath = join(__dirname, "../uploads/images");
  app.use("/images", express.static(imagePath));

  app.use("/admin", adminRoute);
  app.use("/vendor", vendorRoute);
  app.use("/customer", customerRoute);
  app.use("/shopping", shoppingRoute);

  return app;
};
