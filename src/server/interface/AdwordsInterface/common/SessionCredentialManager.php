<?php

use Google\AdsApi\Common\OAuth2TokenBuilder;
use Google\AdsApi\AdWords\AdWordsSessionBuilder;

class SessionCredentialManager
{
    private static $instance = null;

    private $oAuth2Credential;

    private $sessionMap;

    private $initFile;

    private function __construct()
    {
        $this->initFile = ApiConfManager::getInstance()->getApiInitFile();
        $this->oAuth2Credential = (new OAuth2TokenBuilder())
            ->fromFile($this->initFile)
            ->build();
        $this->sessionMap = array();
    }

    public static function getInstance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    /**
     * @return \Google\Auth\Credentials\ServiceAccountCredentials|\Google\Auth\Credentials\UserRefreshCredentials|mixed
     */
    public function getOAuth2Credential()
    {
        return $this->oAuth2Credential;
    }

    public function getAdwordsSession($isValidateOnly = false)
    {
        $sessionBuilder = new AdWordsSessionBuilder();
        $sessionBuilder->fromFile($this->initFile);
        $sessionBuilder->withOAuth2Credential($this->oAuth2Credential);

        if($isValidateOnly)
        {
            $sessionBuilder->enableValidateOnly();
        }

        $session = $sessionBuilder->build();
        $customerId = $session->getClientCustomerId();
        $customerId = str_replace('-', '', $customerId);
        $this->sessionMap[$customerId] = $session;

        return $session;
    }

    public function getSessionByCustomerId($customerId)
    {
        if(array_key_exists($customerId, $this->sessionMap))
        {
            return $this->sessionMap[$customerId];
        }
        else
        {
            $sessionBuilder = new AdWordsSessionBuilder();
            $sessionBuilder->withClientCustomerId($customerId);
            $sessionBuilder->withDeveloperToken(AWCommonConstants::DEVELOPER_TOKEN);
            $sessionBuilder->withOAuth2Credential($this->oAuth2Credential);

            $session = $sessionBuilder->build();
            $this->sessionMap[$customerId] = $session;

            return $session;
        }
    }

}