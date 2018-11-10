#!/usr/bin/env bash

function scpServerFile()
{
   scp -i zengtao.pem -r ubuntu@ec2-52-42-202-255.us-west-2.compute.amazonaws.com:$1 $2
}

#密钥授权
chmod 400 zengtao.pem

serverLogPath='/var/www/html/eli/server/log/'

if [ -z $1 ]
then
    echo "$0 YYYY-MM-DD"
    exit 0
fi

localPath=$(cd `dirname $0`; pwd)"/"

serverLogFile=${serverLogPath}$1".log"
localLogFile=${localPath}$1".log"

scpServerFile ${serverLogFile} ${localLogFile}