<?php
require_once( dirname(__DIR__ ) . '/basic/include_file.php');

printHelloWord();

function printHelloWord()
{
    HelloWordUtil::echoHello();
}