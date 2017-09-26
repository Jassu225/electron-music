
// Adding Listener to "album" class in albums-container in main-section 
$("div.album").click((event)=>{
    console.log(event.currentTarget.childNodes[1].childNodes[1].childNodes[1].src);
    $("div#albums-container").removeClass("z-index-1000").addClass("z-index-1");
    $("div#album-page").removeClass("hide");
    albumsDB.findOne({ _id: event.currentTarget.childNodes[3].childNodes[1].innerHTML }, (err,doc)=>{
        console.log(doc);
        document.getElementById("selected-album-cover").src = event.currentTarget.childNodes[1].childNodes[1].childNodes[1].src;
        var parent = document.getElementById("songs-in-album-container");
        var children = "";
        for(var i = 0; i < doc.songs.length; i++){
            children += `<div class="songs-in-album padding-10 cursor-pointer" src="${doc.songs[i]}">${doc.songs[i].substring(doc.songs[i].lastIndexOf("/")+1)}</div>`;
        }
        parent.innerHTML = children;
        addListenersToSongsInAlbum();
    });
});

// Inner songs container listeners
// Album page listeners
$("div#backToAlbum").click(()=>{
    $("div#album-page").addClass("hide");
    $("div#albums-container").removeClass("z-index-1").addClass("z-index-1000");
});
function addListenersToSongsInAlbum(){
    $("div.songs-in-album").click( event=>{
        console.log(event.currentTarget.getAttribute("src"));
        audio_player.childNodes[0].src = event.currentTarget.getAttribute("src");
        playSong();
    });
}
function searchForSong() {
    
}

