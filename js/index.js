
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
            document.querySelector('#player-list').innerHTML += `<div class="music"><div class="music-title">${music.split('.')[0].replace(/\_/gm, ' ')} <a href="./?a=${music.split('.')[0]}"><i class='bx bxs-right-arrow-circle'></i></a></div><div id="music-${music.split('.')[0]}"></div></div>`
        }

        for await (let music of musicList) {
            new Function("let wavesurfer"+music.split('.')[0]+" = WaveSurfer.create({container: document.querySelector('#music-"+music.split('.')[0]+"'),waveColor: '#dddddd',progressColor: '#ffa358',url: './mp3/"+music+"',barWidth: 2,barGap: 1,barRadius: 2,});wavesurfer"+music.split('.')[0]+".on('interaction', () => {wavesurfer"+music.split('.')[0]+".playPause()})")()
        }

    } else {

        document.querySelector('#player-list').innerHTML += `<div class="music"><div class="music-title">${audio.replace(/\_/gm, ' ')}</div><div id="music0"></div></div>`

        let wavesurfer = WaveSurfer.create({
            container: document.querySelector('#music0'),
            waveColor: '#dddddd',progressColor: '#ffa358',
            url: './mp3/'+audio+'.mp3',
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
        })

        wavesurfer.on('interaction', () => {wavesurfer.playPause()})

    }
})