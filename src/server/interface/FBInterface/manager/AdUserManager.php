<?php

class AdUserManager
{
    private static $instance = null;

    private $currentUserID;

    private $userID2UserEntity = array();


    private function __construct()
    {
        //获取me用户
        $defaultUser = AdUserAccountUtil::getDefaultUserInfo();
        $defaultUserID = $defaultUser->getUserID();
        $this->currentUserID = $defaultUserID;
        $this->userID2UserEntity[$defaultUserID] = $defaultUser;
    }

    public function getUserInfo()
    {
        return $this->userID2UserEntity[$this->currentUserID];
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }
        return static::$instance;
    }

}