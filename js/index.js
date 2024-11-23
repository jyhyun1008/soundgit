
function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject()
var audio = qs.a

var playList = [] //json
var sPlayList = []
var audioplayer
var isShuffle = false
var isPlaying = false
var isLoop = true
var volume = 1;
var currentPlaying = {}

const playBarContoller = function () {
    const timeAudio = () => {
        const duration = audioplayer.duration || 0;
        const timeBar = document.querySelector('#duration')
        const totTime = document.querySelector('#totTime')
        const playTime = document.querySelector('#playTime')
        const tick = duration / 100
        //전체시간 표시
        // 음원 총 재생시간 구하기
        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60);
        const totMin = min.toString().padStart(2, "0");
        const totSec = sec.toString().padStart(2, "0");
        totTime.innerText = `${totMin}:${totSec}`

        // 현재시간 표시
        audioplayer.addEventListener("timeupdate", (event) => {
            //const playTime = $(".current");
            let ctTime = parseInt(audioplayer.currentTime)
            // 프로그레스 바 업데이트
            timeBar.value = `${ctTime / tick}`
            if (pdf && sheet) {
                var pdfHeight = (document.querySelector('.pdf').offsetWidth - 15) * 1.41 * sheet
                document.querySelector('.pdf').style="height: "+pdfHeight+"px;"
                var ctHeight = Math.max(ctTime / duration * pdfHeight - (document.querySelector('#pdf-box').offsetHeight)/2, 0)
                document.querySelector('#pdf-box').scrollTo(0,ctHeight)
            }

            let min = Math.floor(ctTime / 60);
            let sec = Math.floor(ctTime % 60);
            let ctMin = min.toString().padStart(2, "0");
            let ctSec = sec.toString().padStart(2, "0");
            playTime.innerText = `${ctMin}:${ctSec}`
        })

        timeBar.addEventListener("change", (event) => {
            audioplayer.currentTime = parseInt(event.target.value)*tick
        });
    }

    audioplayer.onloadeddata = function(){
        timeAudio(); 
    }
}

const playerController = function () {
    document.querySelector(".playButton").addEventListener("click", function () {
        if (isPlaying) {
            audioplayer.pause()
            document.querySelector(".playButton").innerHTML = "<i class='bx bx-play' ></i>"
            isPlaying = false
        } else {
            audioplayer.play()
            document.querySelector(".playButton").innerHTML = "<i class='bx bx-pause'></i>"
            isPlaying = true
        }
    })

    document.querySelector('body').addEventListener("keydown", (event) => {
        if (event.key == ' ' || event.key == 'Spacebar' || event.keyCode == 32) {
            if (isPlaying) {
                audioplayer.pause()
                document.querySelector(".playButton").innerHTML = "<i class='bx bx-play' ></i>"
                isPlaying = false
            } else {
                audioplayer.play()
                document.querySelector(".playButton").innerHTML = "<i class='bx bx-pause'></i>"
                isPlaying = true
            }
        }
    });

    document.querySelector(".stopButton").addEventListener("click", function () {
        if (isPlaying) {
            audioplayer.pause()
            audioplayer.currentTime = 0;
            document.querySelector(".playButton").innerHTML = "<i class='bx bx-play' ></i>"
            isPlaying = false
        }
    })

    document.querySelector(".loopButton").addEventListener("click", function () {
        if (isLoop) {
            isLoop = false
            audioplayer.loop = isLoop
            document.querySelector(".loopButton").innerHTML = "<i class='bx bx-revision' style='color: white;' ></i>"
        } else {
            isLoop = true
            audioplayer.loop = isLoop
            document.querySelector(".loopButton").innerHTML = "<i class='bx bx-revision' style='color:#ff9899;' ></i>"
        }
    })

    document.querySelector("#volume").addEventListener("change", (event) => {
        audioplayer.volume = parseInt(event.target.value)/100
    });
}

const shuffleController = function () {
    document.querySelector('.shuffleButton').addEventListener("click", function () {
        if (isShuffle) {
            isShuffle = false
            document.querySelector(".shuffleButton").innerHTML = "<i class='bx bx-shuffle' style='color: white;' ></i>"
        } else {
            isShuffle = true
            sPlayList = playList
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            document.querySelector(".shuffleButton").innerHTML = "<i class='bx bx-shuffle' style='color:#ff9899;' ></i>"
        }
    })

    audioplayer.addEventListener("ended", (event) => {
        if(isShuffle) {
            var currentIndex = sPlayList.indexOf(currentPlaying)
            var nextIndex = (currentIndex + 1) % sPlayList.length
            if (!isLoop && nextIndex != currentIndex) {
                audioplayer.pause()
                audioplayer.currentTime = 0
            } else {
                audioplayer.src = sPlayList[nextIndex].url
                document.querySelector("#musicTitle").innerText = sPlayList[nextIndex].title
                audioplayer.play()
                currentPlaying = sPlayList[nextIndex]
            }
        } else {
            var currentIndex = playList.indexOf(currentPlaying)
            var nextIndex = (currentIndex + 1) % playList.length
            if (!isLoop && nextIndex != currentIndex) {
                audioplayer.pause()
                audioplayer.currentTime = 0
            } else {
                audioplayer.src = playList[nextIndex].url
                document.querySelector("#musicTitle").innerText = playList[nextIndex].title
                audioplayer.play()
                currentPlaying = playList[nextIndex]
            }
        }
    })
}

addEventListener("DOMContentLoaded", async (event) => {
    if (!audio) { //main page

        var result1 = await fetch(`https://api.github.com/repos/${USERNAME}/${REPONAME}/git/trees/main?recursive=1`)
        var folderList = await result1.json()

        var musicList = []
        
        for (let folder of folderList.tree) {
            if (folder.path == 'mp3') {
                var result2 = await fetch(folder.url)
                var audioList = await result2.json()

                for (let audio of audioList.tree) {
                    if (audio.path.includes('.mp3')) {
                        //musicList.push(`https://github.com/${USERNAME}/${REPONAME}/raw/refs/heads/main/mp3/${audio.path}`)
                        musicList.push(`${audio.path}`)
                    }
                }
            }
        }

        console.log(musicList)
        for await (let music of musicList) {
            document.querySelector('#player-list').innerHTML += `<div class="music"><div class="music-title">${music.split('.')[0].replace(/\_/gm, ' ')}</div><div id="music-${music.split('.')[0]}"></div></div>`
        }

        for await (let music of musicList) {
            new Function("let wavesurfer"+music.split('.')[0]+" = WaveSurfer.create({container: document.querySelector('#music-"+music.split('.')[0]+"'),waveColor: '#dddddd',progressColor: '#ffa358',url: './mp3/"+music+"',barWidth: 2,barGap: 1,barRadius: 2,});wavesurfer"+music.split('.')[0]+".on('interaction', () => {wavesurfer"+music.split('.')[0]+".playPause()})")()
        }

    } else {
        document.querySelector('body').addEventListener("click", function () {
            if (!document.querySelector("audio")) {

                document.querySelector("#player-list").innerHTML = '<audio style="display:none;" ><source src="'+audio+'" /></audio><div id="playbar"><div id="playTime"></div><div><input type="range" id="duration" class="rangeInput" name="duration" min="0" max="100" value="0" /></div><div id="totTime"></div></div><div id="player"><div class="playButton"><i class="bx bx-play" ></i></div><div class="stopButton"><i class="bx bx-stop" ></i></div><div class="loopButton"><i class="bx bx-revision" style="color:#ff9899;" ></i></div><div><label for="volume"><i class="bx bxs-megaphone" ></i> </label><input type="range" class="rangeInput" id="volume" name="volume" min="0" max="100" value="100" /></div></div></div>'
                audioplayer = document.querySelector("audio")
                audioplayer.loop = isLoop
                audioplayer.volume = volume
                audioplayer.play()
                document.querySelector(".playButton").innerHTML = "<i class='bx bx-pause'></i>"
                isPlaying = true

                playBarContoller()
                playerController()
            }
            
        })
    }
})