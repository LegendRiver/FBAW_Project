<?php

build();

function build()
{
    $file = 'hello.phar';

    $phar = new Phar(__DIR__ . '/' . $file, FilesystemIterator::CURRENT_AS_FILEINFO | FilesystemIterator::KEY_AS_FILENAME, $file);
    $phar->startBuffering();

    $dir = dirname(__DIR__);
    $phar->buildFromDirectory($dir);

    $phar->setStub(Phar::createDefaultStub('script/main.php'));
    $phar->compress(PHar::GZ);
    $phar->stopBuffering();

    echo 'Finished build!!!';
}