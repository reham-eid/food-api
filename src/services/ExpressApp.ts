import express, { Application } from "express";
import cors from 'cors'
import { join } from "path";
import {
  adminRoute,
  customerRoute,
  deliveryRoute,
  shoppingRoute,
  vendorRoute,
} from "../routes";

export default async (app: Application) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
// Middleware

  const imagePath = join(__dirname, "../uploads/images");
  app.use("/images", express.static(imagePath));

  app.use("/admin", adminRoute);
  app.use("/vendor", vendorRoute);
  app.use("/customer", customerRoute);
  app.use("/shopping", shoppingRoute);
  app.use("/delivery", deliveryRoute);


  return app;
};
