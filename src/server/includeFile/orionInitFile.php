<?php

ServerLogger::instance()->setLoggerModule(BasicConstants::LOGGER_TYPE_VALUE_ORION);
//初始化服务
ServiceInitializer::instance()->registerServices();