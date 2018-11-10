<?php
use FacebookAds\Object\AdAccountUser;
use FacebookAds\Object\Fields\AdAccountUserFields;

class AdUserAccountUtil
{
    /**
     * 获取me用户信息
     * @return AdUserEntity
     */
    public static function getDefaultUserInfo()
    {
        $userEntity = new AdUserEntity();
        try
        {
            $userFieldArray = array(
                AdAccountUserFields::ID,
                AdAccountUserFields::NAME
            );
            $user = new AdAccountUser(AdManageConstants::AD_USER_DES_DEFAULT);
            $user->read($userFieldArray);
            $userEntity->setUserID($user->{AdAccountUserFields::ID});
            $userEntity->setUserName($user->{AdAccountUserFields::NAME});
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
        }
        return $userEntity;
    }

}