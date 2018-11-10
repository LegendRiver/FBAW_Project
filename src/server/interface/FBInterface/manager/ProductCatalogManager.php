<?php

use FacebookAds\Object\ProductCatalog;
use FacebookAds\Object\Fields\ProductCatalogFields;

class ProductCatalogManager
{
    public static function createCatalog($businessId)
    {
        try
        {
            $productCatalog = new ProductCatalog(null, $businessId);

            $productCatalog->setData(array(
                ProductCatalogFields::NAME => "Catalog",
            ));

            $productCatalog->create();

            return $productCatalog->{ProductCatalogFields::NAME};
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeLog(Error, $e);
            return false;
        }
    }
}