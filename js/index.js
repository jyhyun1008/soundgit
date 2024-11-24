
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
var audioplayer = document.querySelector("audio")
var isShuffle = false
var isPlaying = false
var isLoop = true
var volume = 1;
var currentPlaying = {}
var isFirstPlay = true

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
    document.querySelector(".playpause").addEventListener("click", function () {
        if (isPlaying) {
            audioplayer.pause()
            document.querySelector(".playpause").innerHTML = "<i class='bx bxs-right-arrow ' ></i>"
            isPlaying = false
        } else {
            audioplayer.play()
            document.querySelector(".playpause").innerHTML = "<i class='bx bxs-square' ></i>"
            isPlaying = true
        }
    })

    document.querySelector('body').addEventListener("keydown", (event) => {
        if (event.key == ' ' || event.key == 'Spacebar' || event.keyCode == 32) {
            if (isPlaying) {
                audioplayer.pause()
                document.querySelector(".playpause").innerHTML = "<i class='bx bxs-right-arrow' ></i>"
                isPlaying = false
            } else {
                audioplayer.play()
                document.querySelector(".playpause").innerHTML = "<i class='bx bxs-square' ></i>"
                isPlaying = true
            }
        }
    });

    document.querySelector(".replay").addEventListener("click", function () {
        if (isLoop) {
            isLoop = false
            audioplayer.loop = isLoop
            document.querySelector(".replay").innerHTML = "<i class='bx bx-refresh' style='color: #00000055;' ></i>"
        } else {
            isLoop = true
            audioplayer.loop = isLoop
            document.querySelector(".replay").innerHTML = "<i class='bx bx-refresh' style='color: black;' ></i>"
        }
    })

    document.querySelector(".volume").addEventListener("click", (event) => {
        if (document.getElementById("volume-box").style.display == 'none') {
            document.getElementById("volume-box").style.display = 'flex'
        } else {
            document.getElementById("volume-box").style.display = 'none'
        }
    });

    document.querySelector("#volume").addEventListener("change", (event) => {
        audioplayer.volume = parseInt(event.target.value)/100
    });
}

addEventListener("DOMContentLoaded", async (event) => {
    if (!audio) { //main page

        var result1 = await fetch(`https://api.github.com/repos/${USERNAME}/${REPONAME}/git/trees/main?recursive=1`)
        var folderList = await result1.json()

        var musicList = []
        var imgList = []
        
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

        var index = 0;

        for await(let music of musicList) {

            let img
            try {
                var fetchImg = await fetch('./img/'+music.split('.')[0]+'.png', {mode: "no-cors"})
                console.log(fetchImg)
                if (fetchImg.status == 404) throw new Error('Request faild');
                imgList.push('./img/'+music.split('.')[0]+'.png')
                img = './img/'+music.split('.')[0]+'.png'
            } catch (err) {
                imgList.push('./peachtart1.png')
                img = './peachtart1.png'
            }
            
            document.querySelector('#player-overflow').innerHTML += `
            <div class="play-title-box">
                <div class="play-play-box" id="playbox${index}">
                    <div class="play-img-box">
                        <img src="${img}">
                    </div>
                    <div class="play-info-box">
                        <div class="play-title">${music.split('.')[0].split('_')[1].replace(/\-/gm, ' ')}</div>
                        <div class="play-user">${music.split('_')[0]} · 재연</div>
                    </div>
                </div>
                <a href="./?a=${music.split('.')[0]}"><div class="play-link-box">
                    <i class='bx bx-chevron-right' ></i>
                </div></a>
            </div>`
            index++;
        }

        console.log(imgList)

        for(let i=0; i<musicList.length; i++ ) {

            document.querySelector(`#playbox${i}`).addEventListener('click', ()=> {

                for (let j=0; j<musicList.length; j++) {
                    if (j == i) {
                        document.querySelector(`#playbox${j}`).classList.add('nowplaying')
                    } else {
                        document.querySelector(`#playbox${j}`).classList.remove('nowplaying')
                    }
                }
                document.querySelector('#controller-box').classList.remove('inactive')
                audioplayer.src = './mp3/'+musicList[i]
                audioplayer.loop = isLoop
                audioplayer.volume = volume
                document.querySelector('#img-box').innerHTML = `<img src="${imgList[i]}">`
                audioplayer.play()

                document.querySelector(".playpause").innerHTML = "<i class='bx bxs-square' ></i>"
                isPlaying = true

                if (isFirstPlay) {
                    playBarContoller()
                    playerController()
                    isFirstPlay = false
                }

            })

        }

    } else {

        document.querySelector('#controller-box').classList.remove('inactive')
        try {
            var fetchImg = await fetch('./img/'+audio+'.png', {mode: "no-cors"})
            if (fetchImg.status == 404) throw new Error('Request faild');
            document.querySelector('#img-box').innerHTML = `<img src="./img/${audio}.png">`
        } catch (err) {
            document.querySelector('#img-box').innerHTML = `<img src="./peachtart1.png">`
        }
        
        audioplayer.src = './mp3/'+audio+'.mp3'
        audioplayer.loop = isLoop
        audioplayer.volume = volume

        if (isFirstPlay) {
            playBarContoller()
            playerController()
            isFirstPlay = false
        }

        var infoUrl = "https://raw.githubusercontent.com/"+USERNAME+"/"+REPONAME+`/main/info/${audio}.md`

        fetch(infoUrl)
        .then(res => res.text())
        .then((out) => {
            document.querySelector('#player-overflow').innerHTML = marked.parse(out)
        })

    }
})