
// Adding Listener to "album" class in albums-container in main-section
function addAlbumListeners(){
    $("div.album").click((event)=>{
        hideAlbumContextMenu();
        albums_container.classList.remove("active-main-page");
        albums_page.classList.add("active-main-page");
        albumsDB.findOne({ _id: event.currentTarget.childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML }, (err,doc)=>{
            if(doc){
                selected_album_cover.src = event.currentTarget.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].src;
                var parent = document.getElementById("songs-in-album-container");
                var children = "";
                for(var i = 0; i < doc.songs.length; i++){
                    var i1 = doc.songs[i].lastIndexOf('/');
                    var i2 = doc.songs[i].lastIndexOf('\\');
                    var index = i1 > i2 ? i1 : i2 ;
                    children += `<div class="songs-in-album padding-10 cursor-pointer" src="${doc.songs[i]}">${doc.songs[i].substring(index+1)}` +
                                    `<ul style="float:right;">` +
                                        `<li><i class="fa fa-play" aria-hidden="true" onmouseover="showPlayMenu(event,this)"></i></li>` +
                                        `<li><i class="fa fa-plus" aria-hidden="true" onmouseover="showAddMenu(event,this)"></i></li>` +
                                        `<li><i class="fa fa-trash" onmouseover="showDeleteMenu(event,this)"></i></li>`+
                                    `</ul>` +
                                `</div>`;
                }
                parent.innerHTML = children;
                children = null;
                addListenersToSongsInAlbum();
            }
            if(err)
                console.log(err);
        });
    });
}

// Adding Listeners to "artist" class in artists-container in main-section
function addArtistListeners(){
    $("div.artist").click((event)=>{
        artists_container.classList.remove("active-main-page");
        artists_page.classList.add("active-main-page")
        artistsDB.findOne({ _id: event.currentTarget.childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML }, (err,doc)=>{
            if(doc){
                var parent = document.getElementById("songs-in-artist-container");
                var children = "";
                for(var i = 0; i < doc.songs.length; i++){
                    var i1 = doc.songs[i].lastIndexOf('/');
                    var i2 = doc.songs[i].lastIndexOf('\\');
                    var index = i1 > i2 ? i1 : i2 ;
                    children += `<div class="songs-in-artist padding-10 cursor-pointer" src="${doc.songs[i]}">${doc.songs[i].substring(index+1)}</div>`;
                }
                parent.innerHTML = children;
                children = null;
                addListenersToSongsInArtist();
            }
            if(err)
                console.log(err);
        });
    });
}

// Inner songs container listeners
// Album page listeners
$("div#backToAlbum").click(()=>{
    $("div#album-page").removeClass("active-main-page");
    $("div#albums-container").addClass("active-main-page");
    songs_in_album_page.innerHTML = "";
});
function addListenersToSongsInAlbum(){
    $("div.songs-in-album").click( event=>{
        var src = event.currentTarget.getAttribute("src");
        audio_player.childNodes[0].src = src;
        activePlaylist.playNow(src);
        playSong();
    });
}
function removeSong(element,key){
    var src = element.getAttribute("src");
    songsDB.findOne({ _id: src }, function (err, doc) {
        songsDB.remove({ _id: src }, {}, function (err, numRemoved) {
            if(err)
                console.log(err);
            else
                console.log("deletion from songsDB successful");
        });
        albumsDB.update({ _id: doc.album }, { $pull: { songs: src } }, {}, function () {
            // Now the fruits array is ['orange', 'pear']
        });
        artistsDB.update({ _id: doc.artist }, { $pull: { songs: src } }, {}, function () {
            // Now the fruits array is ['orange', 'pear']
        });
    });
    if(key == "delete"){
        fs.unlink(src, (err) => {
            if (err) console.log(err);
            else console.log('file successfully deleted');
        });
    }
    element.parentElement.remove(element);
}
function addTo(src,key){
    console.log("addto called");
    switch(key){
        case "Play Next": activePlaylist.playNext(src);break;
        case "Queue": activePlaylist.addSong(src);break;
        case "New Playlist":  showModal([src]);
    }
}
//Listeners for "play" icon
function showPlayMenu(event,element){
    var target = document.getElementById("context-menu-album");
    var songContainer = element.parentElement.parentElement.parentElement;
    var mainParent = songContainer.parentElement.parentElement;
    var elementRect = element.getBoundingClientRect();
    var mainParentRect = mainParent.getBoundingClientRect();
    var items = ["Play Next","Add To...","Queue"];
    var src = songContainer.getAttribute("src");
    var children = "";
    children += `<div onclick="addTo('${src}','${items[0]}');" style="width:100%;height:40px;line-height:40px;cursor:pointer;flex:1;">${items[0]}</div>`;
    children += `<div style="width:100%;height:40px;line-height:40px;flex:1;cursor:pointer;">${items[1]}</div>`;
    children += `<div onclick="addTo('${src}','${items[2]}');" style="width:100%;height:40px;line-height:40px;cursor:pointer;flex:1;">${items[2]}</div>`;
    target.innerHTML = children;
    target.style.transform = `translate3d(${elementRect.left - mainParentRect.left - 194}px,${elementRect.top - mainParentRect.top}px,0px)`;
    target.classList.remove("hide");
}
// Adding listeners to "+" icons in songs
function showAddMenu(event,element){
    var target = document.getElementById("context-menu-album");
    var songContainer = element.parentElement.parentElement.parentElement;
    var mainParent = songContainer.parentElement.parentElement;
    var elementRect = element.getBoundingClientRect();
    var mainParentRect = mainParent.getBoundingClientRect();
    var src = songContainer.getAttribute("src");
    var children = "";
    children += `<div onclick="addTo('${src}','New Playlist');" style="width:100%;height:40px;line-height:40px;cursor:pointer;flex:1;border-bottom:1px solid #444444;">Create Playlist</div>`;
    for(var i = 0; i < savedPlaylists.length; i++)
        children += `<div style="width:100%;height:40px;line-height:40px;flex:1;cursor:pointer;" onclick="addSongToPlaylist(event,'${src}')">${savedPlaylists[i]._id}</div>`;
    target.innerHTML = children;
    target.style.transform = `translate3d(${elementRect.left - mainParentRect.left - 194}px,${elementRect.top - mainParentRect.top}px,0px)`;
    target.classList.remove("hide");
}
//Adding listeners to "delete" icons in songs
function showDeleteMenu(event,element){
    var target = document.getElementById("context-menu-album");
    var songContainer = element.parentElement.parentElement.parentElement;
    var mainParent = songContainer.parentElement.parentElement;
    var elementRect = element.getBoundingClientRect();
    var mainParentRect = mainParent.getBoundingClientRect();
    var items = ["remove","delete"];
    var children = "";
    for(var i = 0; i < items.length; i++){
        children += `<div onclick="removeSong(${songContainer},'${items[i]}')" style="width:100%;height:40px;line-height:40px;cursor:pointer;flex:1;">${items[i]}</div>`;
    }
    target.innerHTML = children;
    target.style.transform = `translate3d(${elementRect.left - mainParentRect.left - 194}px,${elementRect.top - mainParentRect.top}px,0px)`;
    target.classList.remove("hide");
}
function hideAlbumContextMenu(){
    document.getElementById("context-menu-album").classList.add("hide");
}
// Artist page listeners
$("div#backToArtist").click(()=>{
    $("div#artist-page").removeClass("active-main-page");
    $("div#artists-container").addClass("active-main-page");
    songs_in_artist_page.innerHTML = "";
});
function addListenersToSongsInArtist(){
    $("div.songs-in-artist").click( event=>{
        console.log(event.currentTarget.getAttribute("src"));
        audio_player.childNodes[0].src = event.currentTarget.getAttribute("src");
        playSong();
    });
}
// ALBUMS CONTAINER LISTENERS
albums_container.addEventListener("wheel", event=>{
    albums_container.scrollLeft -= (event.wheelDelta || event.detail) * 0.65;
    event.preventDefault();
});
//******************************* FOOTER LISTENERS *******************************************************************/
// Keydown listener function for textarea
document.getElementById("feedback-field").addEventListener("keyup", (event)=>{
    document.getElementById("chars-left").innerHTML = `${500 - document.getElementById("feedback-field").value.length} characters left.`;
});
// Additional functions required
function fetchPlaylists(){

}