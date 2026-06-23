import supertest from "supertest";
import "dotenv/config";
import { prefix } from "@src/app";

const API_URL = `${process.env.APP_HOST || "http://localhost"}:${process.env.PORT || 3000}${prefix}`;

export const request = supertest(API_URL);
