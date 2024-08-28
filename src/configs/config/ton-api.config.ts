import { registerAs } from "@nestjs/config"

export default registerAs("ton-api-config", () => ({
    apiUrl: process.env.TON_API_URL || "",
    apiKey: process.env.TON_API_KEY || ""
}))
