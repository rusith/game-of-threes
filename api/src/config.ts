import * as dotenv from "dotenv";
dotenv.config();

const config = {
  port: () => parseInt(process.env.PORT || "8080"),
  dbUrl: () => process.env.DB_URL!,
};

export default config;
