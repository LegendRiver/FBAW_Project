<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 10/19/16
 * Time: 10:14 AM
 */
class CEncrypt
{
    protected $key;

    private $Log = null;
    public function __construct($log)
    {
        $this->Log = $log;
    }

    public function mcryptDecrypt($encryptedData, $key)
    {
        $this->key = base64_decode($key);
        return CAesCtr::decrypt($encryptedData, $this->key, 256);
    }

    public function mcryptEncrypt($plainContent, $key)
    {
        $this->key = base64_encode($key);

        return CAesCtr::encrypt($plainContent, $key, 256);
    }
}