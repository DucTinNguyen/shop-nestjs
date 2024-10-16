import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export const setupSwagger = (app: INestApplication): void => {
    const config = new DocumentBuilder().setTitle("E-commerce API").setDescription("E-commerce API description").setVersion("1.0").addBearerAuth().build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true
        }
    })
}
