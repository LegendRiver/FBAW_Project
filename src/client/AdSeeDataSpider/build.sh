#!/usr/bin/env bash

 dmcs -out:/home/work/AutoWebBrowser/AutoWebBrowser.exe AutoWebBrowser/*.cs -r:AutoWebBrowser/bin/Debug/WebDriver.dll -r:AutoWebBrowser/bin/Debug/WebDriver.Support.dll -r:AutoWebBrowser/bin/Debug/Winista.HtmlParser.dll  -r:System.Data.dll -r:System.Windows.Forms.dll -r:/home/work/mysqlconnector/v4.0/MySql.Data.dll -r:System.Drawing.dll -r:System.Web.dll -r:System.Web.Extensions.dll -r:/home/work/Json45r11/Bin/Net40/Newtonsoft.Json.dll
