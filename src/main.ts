import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {AppClusterService} from "./app-cluster.service";
const dotenv = require("dotenv");

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({origin: "*"});
    await app.listen(+process.env.PORT);
}

AppClusterService.clusterize(bootstrap);
