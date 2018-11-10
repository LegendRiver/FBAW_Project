#!/usr/bin/env bash

 dmcs -platform:x86 -out:./output/BeiDouMonitorServer.exe ./BeiDouMonitor/*.cs -r:System.Data.dll -r:System.Windows.Forms.dll -r:../cs_third_lib/mysqlconnector/v4.0/MySql.Data.dll -r:../cs_third_lib/Json45r11/Bin/Net40/Newtonsoft.Json.dll
