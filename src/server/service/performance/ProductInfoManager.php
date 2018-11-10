<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/16
 * Time: 下午6:03
 */
class ProductInfoManager extends ServiceObject
{
    public function queryProductInfo()
    {
        $productInfo = BasicInfoDataHandler::instance()->getProductStateData();
        return $productInfo;
    }
}