import { registerAs } from "@nestjs/config"

export default registerAs("ton-center-config", () => ({
    apiUrl: process.env.TON_CENTER_API_URL || "",
    apiKeys: process.env.TON_CENTER_API_KEY?.split(",") || []
}))
