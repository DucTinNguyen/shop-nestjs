import AirdropConfig from "./airdrop.config"
import AppConfig from "./app.config"
import AuthConfig from "./auth.config"
import RedisConfig from "./redis.config"
import TonApiConfig from "./ton-api.config"
import TonCenterConfig from "./ton-center.config"

const configurations = [AppConfig, TonApiConfig, TonCenterConfig, AirdropConfig, AuthConfig, RedisConfig]

export { AirdropConfig, AppConfig, AuthConfig, RedisConfig, TonApiConfig, TonCenterConfig, configurations }
