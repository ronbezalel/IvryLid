window.onload = function() {	
    $(".navbar-nav li a").click(function (event) {
        $(".navbar-collapse").collapse('hide');
    });    
};


function Song(songName, date, length, views, imgUrl, iframUrl){
	
	var _iframeLink = iframUrl;
	var _length = length;
	var _date = date;
	var _songName = songName;
	var _views = views;
	
	var sectionObj = document.createElement('section');
	sectionObj.className = 'songLink';
	sectionObj.addEventListener('click', changeIframe);

	var infoObj =  document.createElement('section');
	infoObj.className = 'songRecordInfo';
	
	var titleObj = document.createElement('h5');
	titleObj.innerHTML = songName;
	
	var dateObj = document.createElement('h6');
	dateObj.innerHTML = date;
	
	var lengthObj = document.createElement('h6');
	lengthObj.innerHTML = length;
	
	var viewsObj = document.createElement('h6');
	viewsObj.innerHTML = views;
	
	infoObj.appendChild(titleObj);
	infoObj.appendChild(dateObj);
	infoObj.appendChild(lengthObj);
	infoObj.appendChild(viewsObj);
	
	sectionObj.appendChild(infoObj);
	
	var imgContainer = document.createElement('section');
	imgContainer.className = 'imgContainer';
	
	var imgObj = document.createElement('img');
	imgObj.src = imgUrl;
	
	var redImg = document.createElement('section');
	redImg.className = 'redImg';
	
	imgContainer.appendChild(redImg);
	imgContainer.appendChild(imgObj);
	
	sectionObj.appendChild(imgContainer);
	
	function changeIframe() {
		var iframObj = document.getElementById('iframe');
		console.log(_iframeLink);
		iframObj.src = _iframeLink;
		
		document.getElementById('songName').innerHTML = _songName;
		document.getElementById('dateInfo').innerHTML = _date;
		document.getElementById('lengthInfo').innerHTML = _length;
		document.getElementById('viewsInfo').innerHTML = _views;
		
	}
	
	this.getSongObj = function () {
		return sectionObj;
	};
	
	this.setIframe = changeIframe;	
}

function IvtvManager() {
	
	function setDefaultSong() {
		var song = songsList[0];
		console.log(song);
		song.setIframe();
	}

	var songsList = [];
	var listObj = document.getElementById('songsList');
	
	$.getJSON("includes/songList.json", function (data) {
		for (var i = 0; i < data.songs.length; i++){
			var songData = data.songs[i]	;
			var song = new Song(
				songData.songName, songData.date, songData.length, songData.views, songData.imgUrl, songData.iframUrl
				);
			songsList.push(song);
			
			var obj = song.getSongObj();
			listObj.appendChild(obj);
		}
		 setDefaultSong();
	});
}

function Update(id, date, day, title, description, imgUrl){
	
	var _id = id;
	var _date = date;
	var _day = day;
	var _title = title;
	var _description = description;
	var _imgUrl = imgUrl;
	
	function showArrow(){
		$("#arrow_"+_id).css("visibility","visible");
	}
	
	function hideArrow(){
		$("#arrow_"+_id).css("visibility","hidden");
	}
	
	function showDescription(){
		var descriptionObjects = $("#updateInfo").children().children();
		descriptionObjects[0].src = _imgUrl;
		descriptionObjects.children()[0].innerHTML = _day + " " + _date;
		descriptionObjects.children()[1].innerHTML = _description;
	}
	//create date object
	var dateObject = document.createElement('p');
	dateObject.innerHTML = _date;
	//create title object
	var titleObject = document.createElement('p');
	titleObject.innerHTML = _title;
	titleObject.addEventListener('mouseover', showArrow);
	titleObject.addEventListener('mouseout', hideArrow);
	titleObject.addEventListener('click', showDescription);
	//create arrow object
	var arrowObject = document.createElement('p');
	arrowObject.innerHTML = '&#60;';
	arrowObject.id = "arrow_"+ _id;
	
	//insert new date object to the html
	$("#dates").children()[0].appendChild(dateObject);
	//insert new title object to the html
	$("#updatesDesc").children()[0].appendChild(titleObject);
	//insert new arrow object to the html
	$("#expend")[0].appendChild(arrowObject);	
	
	this.setDesc = showDescription;
}

function UpdatesManager(){
	
	var defaultUpdate;
	
	function setDefaultDesc() {
		defaultUpdate.setDesc();
	}
	
	function getUpdatesFromDB(){
		$.ajax({
			url: 'action.php',
			data: "",
			dataType: 'json',
			success: function(data){
				console.log("SUCCES to send");
				createUpdatesFromResult(data);
			}
			
		}).fail(function ( jqXHR, textStatus, errorThrown ) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);;
        });
	}
	
	getUpdatesFromDB();
	
	function createUpdatesFromResult(data){
		for(var i = 0; i < data.length; i++){
			var updateData = data[i];
			var update = new Update(
				updateData.id, updateData.date, updateData.day, 
				updateData.title, updateData.description, updateData.imageURL
				);
			if(i==0){
				defaultUpdate = update;
			}
		}
		setDefaultDesc();
	}
}

function AdminManager() {
		$(function (){
			$("#posts").submit(function(){
				var date = $("#date").val();
				var title = $("#title").val();
				var description = $("#description").val();
				var day = $("#day").val();
				var imgURL = $("#imgURL").val();
				var dataString = 'date=' + date + '&title=' + title +  
				'&description=' + description + '&day=' + day +	
				'&imgURL=' + imgURL;
				
				$("#loader").show();
				$("#loader").fadeIn(300).html('<span class="loading">loading...</span>');
				
				console.log("result", dataString);
				$.ajax({
					type: 'POST',
					url: 'insert.php',
					data: dataString,
					cache: true,
					success: function(data){
						$("#loader").hide();
					}
					
					}).fail(function ( jqXHR, textStatus, errorThrown ) {
				    console.log(jqXHR);
				    console.log(textStatus);
				    console.log(errorThrown);;
			    });
			});
		});	
}


function SongLyrics(id, songName, lyrics, imageUrl){
	this._id = id;
	this._songName = songName;
	this._lyrics = lyrics;
	this._imageUrl = imageUrl;
}

function SongWrapper(id, songName, lyrics, songImageUrl ,sectionObject){
	var _id = id;
	var _songName = songName;
	var _lyrics = lyrics;
	var _songImageUrl = songImageUrl;
	
	var songSectionObject = document.createElement('section');
	songSectionObject.className = "diskSongName";
	songSectionObject.innerHTML = _songName;
	songSectionObject.addEventListener('click', showFullLyrics);
			
	sectionObject.appendChild(songSectionObject);
			
	function showFullLyrics(){
		if($("#songLyrics")[0] === undefined){
			createFullLyricsSection();
		}
			else {
			//remove songLyrics section
			var mainTag = document.getElementsByTagName("main")[0];
			mainTag.removeChild(document.getElementById("songLyrics"));
			createFullLyricsSection();
		}	
	}
	
	function createFullLyricsSection(){
		var songLyricsSection = document.createElement('section');
		songLyricsSection.className = 'sectionTopper';
		songLyricsSection.id = 'songLyrics';
		//create image object
		var img = document.createElement('img');
		img.src = _songImageUrl;
		songLyricsSection.appendChild(img);
		
		//create lyrics
		for(var i = 0; i < _lyrics.length; i++){
			var line = document.createElement('p');
			line.innerHTML = _lyrics[i];
			
			songLyricsSection.appendChild(line);
		}
		
		$("main")[0].appendChild(songLyricsSection);
		
	}
}

function Disk(id, diskName, year, diskImageURL, songs){
	 var _id = id;
	 var _diskName = diskName;
	 var _year = year;
	 var _diskImageURL = diskImageURL;
	 var _songs = songs;
	 
	//create disk name object
	var diskNameObject = document.createElement('section');
	diskNameObject.className = 'diskCover';
	diskNameObject.id = _id;
	//create h5 object
	var hObject = document.createElement('h5');
	hObject.innerHTML = _diskName;
	//append h5 to the disk name object
	diskNameObject.appendChild(hObject);
	//append bridge object
	var bridgeObject = document.createElement('p');
	bridgeObject.id = "bridge_" + _id;
	$("#diskBridge")[0].appendChild(bridgeObject);
	
	$("#disks").children()[0].appendChild(diskNameObject);
	//attach listeners to disk
	diskNameObject.addEventListener('mouseover', showImage);
	diskNameObject.addEventListener('mouseout', hideImage);
	diskNameObject.addEventListener('click', showDiskSongs);
	
	function showImage(){
		var diskImageObject = document.createElement('img');
		diskImageObject.src = _diskImageURL;
		diskNameObject.appendChild(diskImageObject);
	}
	
	function hideImage(){
		diskNameObject.removeChild(diskNameObject.childNodes[1]);
	}
	
	function createSongsSection(){
		//create diskSongs object
		var diskSongsSectionObject = document.createElement('section');
		diskSongsSectionObject.className = 'sectionTopper';
		diskSongsSectionObject.id = "diskSongs";
		//create inner section
		var SectionObject = document.createElement('section');
		var index = _id.split("_")[1];
		SectionObject.style.paddingTop = 26*parseInt(index) + "px";
		console.log("padding issur", parseInt(index));	
		//create disk year object
		var yearSectionObject = document.createElement('section');
		yearSectionObject.className = 'diskYear';
		var hObject = document.createElement('h5');
		hObject.innerHTML = _year;
		yearSectionObject.appendChild(hObject);
		//add disk year to diskSongs
		SectionObject.appendChild(yearSectionObject);
		
		//create songsLyrics objects
		for(var i=0; i < _songs.length; i++){
			//var songSectionObject = document.createElement('section');
			//songSectionObject.className = "diskSongName";
			//songSectionObject.innerHTML = _songs[i]._songName;
			
			//SectionObject.appendChild(songSectionObject);
			
			var song = new SongWrapper(i, _songs[i]._songName, _songs[i]._lyrics, _songs[i]._imageUrl, SectionObject);
		}
		diskSongsSectionObject.appendChild(SectionObject);
		$("main")[0].appendChild(diskSongsSectionObject);
		$("#bridge_" + _id).css("visibility","visible");
	}
	
	function hideBridges(){
		var bridges = $("#diskBridge").children();
		console.log("bridges", bridges);
		var index = parseInt(_id.split("_")[1]);
		for(var k=0; k < bridges.length; k++){
			if(k != index){
				bridges[k].style.visibility = "hidden";
			}
		}
	}
	
	function showDiskSongs(){
		console.log($("#diskSongs")[0]);
		//remove nothing
		if($("#diskSongs")[0] === undefined){
			createSongsSection();
		}
		else {
			//remove songLyrics section
			if(!($("#songLyrics")[0] === undefined)){
				var mainTag = document.getElementsByTagName("main")[0];
				mainTag.removeChild(document.getElementById("songLyrics"));
			}
			//remove diskSongs section
			var mainTag = document.getElementsByTagName("main")[0];
			mainTag.removeChild(document.getElementById("diskSongs"));
			hideBridges();
			createSongsSection();
		}	
	}
}

function MusicManager(){
	var disks = [];
	
	$.getJSON("includes/disks.json", function (data) {
		for (var i = 0; i < data.disks.length; i++){
			var diskSongs = [];
			var diskData = data.disks[i];
			//parse the songs in a disk
			for(var j = 0; j < diskData.songs.length; j++){
				var songLyric = new SongLyrics("songLyric_" + j, diskData.songs[j].songName, diskData.songs[j].songLyric, diskData.songs[j].SongImageUrl);
				diskSongs.push(songLyric);
			}
			
			//create disk object
			var disk = new Disk(
				"disk_" + i, diskData.diskName, diskData.year, diskData.diskImageURL, diskSongs
				);
			disks.push(disk);
		}
	});
	console.log("Disks: ", disks);
}
