<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 9/24/15
 * Time: 9:17 PM
 */
class CHttpRequest
{
    public static function sendPost($url, $post_data,$isPost, $proxy)
    {
        $postBuildData = http_build_query($post_data);
        $curlClient = curl_init();
        curl_setopt($curlClient, CURLOPT_RETURNTRANSFER, 1);
        if($isPost)
        {
            curl_setopt($curlClient, CURLOPT_POST, 1);
        }
        else
        {
            curl_setopt($curlClient, CURLOPT_POST, 0);
        }

        curl_setopt($curlClient, CURLOPT_HEADER, 0);
        if($proxy)
        {
            curl_setopt($curlClient, CURLOPT_PROXY, $proxy);
        }
        curl_setopt($curlClient, CURLOPT_URL, $url);
        curl_setopt($curlClient, CURLOPT_COOKIEJAR, 'cookie.txt');
        curl_setopt($curlClient, CURLOPT_POSTFIELDS, $postBuildData);
        $result = curl_exec($curlClient);
        curl_close($curlClient);

        return CHttpRequest::cleanUtf8Bom($result);
    }

    private static function cleanUtf8Bom($content)
    {
        return preg_replace('/\x{FEFF}/u', '', $content);
    }
}

