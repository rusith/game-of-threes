import * as dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || "8080"),
};

export default config;
