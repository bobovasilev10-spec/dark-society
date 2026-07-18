<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class ImageService
{
    public string $external_url;
    public string $local_path = '';

    public function __construct($external_url, $local_path = false)
    {
        $this->external_url = $external_url;
        if($local_path) {
            $this->local_path = $local_path.'/';
        }
    }

    public function download($filename_only = false) {
        $url = str_replace(' ', '%20', $this->external_url);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $image_contents = curl_exec($ch);
        curl_close($ch);

        $filename = basename($this->external_url);

        if ($image_contents !== false) {
            $full_path = 'public/'.$this->local_path. $filename;

            Storage::put($full_path, $image_contents);

            if($filename_only) {
                return $filename;
            }

            return $this->local_path. $filename;
        }

        return null;
    }
}
