<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 11/2/15
 * Time: 4:48 PM
 */
class CNode
{
    public static $KEY_FIELD = "Key";
    public static $LABEL_FIELD = "Label";
    public static $IS_SELECTED = "IsSelected";
    public static $CHILDREN_FIELD = "Children";


    private $Properties = null;

    public function  __construct()
    {
        $this->Properties = array();
        $this->initProperties();
    }

    public function __destruct()
    {
        unset($this);
    }

    private function initProperties()
    {
        $this->Properties[self::$KEY_FIELD] = "";
        $this->Properties[self::$LABEL_FIELD] = "";
        $this->Properties[self::$IS_SELECTED] = false;
        $this->Properties[self::$CHILDREN_FIELD] = array();
    }

    public function addChild($node)
    {
        array_push($this->Properties[self::$CHILDREN_FIELD], $node->getValue());
    }

    public function setFieldValue($fieldName, $fieldValue)
    {
        $this->Properties[$fieldName] = $fieldValue;
    }

    public function getFieldValue($fieldName)
    {
        return $this->Properties[$fieldName];
    }

    public function getValue()
    {
        return $this->Properties;
    }

    public  function convertObject2Array()
    {
        $valueArray = array();
        foreach($this->_ResultFields as $field)
        {
            if(array_key_exists($field, $this->Properties))
            {
                array_push($valueArray, $this->Properties[$field]);
            }
            else
            {
                array_push($valueArray, null);
            }
        }

        return $valueArray;
    }
}