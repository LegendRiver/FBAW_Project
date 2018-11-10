<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 12/3/16
 * Time: 7:05 PM
 */

class CTable
{
    private  $Columns=null;
    private $Records = null;
    public function  __construct()
    {
        $this->Columns = array();
        $this->Records = array();
    }

    public function  __destruct()
    {
        unset($this->Columns);
        unset($this->Records);
    }

    public function addColumn(&$column)
    {
        if(array_key_exists($column->Name, $this->Columns))
        {
            return false;
        }

        $column->Index = count($this->Columns);
        $this->Columns[$column->Name] = $column;
        return true;
    }

    public function addRecord($record)
    {
        array_push($this->Records, $record);
    }

    public function getRecords()
    {
        return $this->Records;
    }

    public  function getColumns()
    {
        return $this->Columns;
    }
}