<?php

class Song{
    public $song_id;
    public $title;
}

class Playlist{
    public $name;
    public $songs = [];

    public function add_song(Song $song){
        $this->songs[] = $song;
    }
}

$octupus_song = new Song();

$octupus_song->song_id = 1;
$octupus_song->title = "Octopus's Garden";

// var_dump($octupus_song);

$playlist = new Playlist();

$playlist->name = "Stupid";
$playlist->add_song($octupus_song);

// var_dump($playlist);
print_r($playlist);

?>