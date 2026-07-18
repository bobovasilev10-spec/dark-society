<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xls;

class ConverterService
{
    public function convertXlsToCsv(string $file)
    {
        $reader = new Xls();
        $spreadsheet = $reader->load(storage_path('app/public/' . $file));

        $csv = storage_path('app/temp.csv');
        $data = [];
        foreach($spreadsheet->getActiveSheet()->getRowIterator() as $row){
            $data[] = [];
            foreach($row->getCellIterator() as $cell){
                $data[count($data) - 1][] = $cell->getValue();
            }
        }

        $file = fopen($csv, 'w+');
        foreach($data as $row){
            fputcsv($file, $row);
        }

        fclose($file);

        return $csv;
    }

}
