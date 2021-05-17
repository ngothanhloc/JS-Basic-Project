const playList = document.querySelector(".playlist");
const heading = document.querySelector("header h2");
const cdThumb = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const playBtn = document.querySelector(".btn-toggle-play");
const player = document.querySelector(".player");
const progress = document.querySelector(".progress");
const cd = document.querySelector(".cd");
const PLAYER_STORAGE_KEY = 'PLAYER_KEY'
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');
const rdBtn = document.querySelector('.btn-random');
const repeatBtn = document.querySelector('.btn-repeat');


const app = {
  isRandom: false,
  currentIndex: 0,
  isPlaying: false,
  isReapeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Muộn Rồi Mà Sao Còn",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/MuonRoiMaSaoCon.mp3",
      image: "./assets/img/muonroimasaocon.jpg",
    },
   
    {
      name: "Kiss Me More",
      singer: "Doja Cat",
      path: "./assets/music/Kiss_Me_More_Doja_Cat.mp3",
      image: "./assets/img/Kissme.jpg",
    },
    {
      name: "Montero",
      singer: "Lil Nas X",
      path: "./assets/music/Montero.mp3",
      image: "./assets/img/Montero.jpg",
    },
    {
      name: "Nevada",
      singer: "Vicetone",
      path: "./assets/music/Vicetone_Nevada.mp3",
      image: "./assets/img/Vicetone_Nevada.jpg",
    },
    {
      name: "Astronaut In The Ocean by MaskedWolf",
      singer: "Vicetone",
      path: "./assets/music/AstronautInTheOceanbyMaskedWolf.mp3",
      image: "./assets/img/AstronautInTheOceanbyMaskedWolf.jpg",
    },
  ],
  setConfig: function (key,value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return ` 
        <div class="song ${index === this.currentIndex? 'active': ''}" data-index = '${index}'>
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });
    playList.innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    _this = this;
    const cdWidth = cd.offsetWidth;
    const cdThumanimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumanimate.pause();
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Handle play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumanimate.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumanimate.pause();
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPrecent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPrecent;
      }

      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };
    };
    nextBtn.onclick = function () {
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scroolToActiveSong();
    }
    prevBtn.onclick = function () {
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.prevSong();
      }
         audio.play();
    }
    rdBtn.onclick = function () {
      _this.isRandom = !_this.isRandom
      _this.setConfig('isRandom', _this.isRandom)
      rdBtn.classList.toggle('active', _this.isRandom)

    }
    repeatBtn.onclick = function (e) {
      _this.isReapeat = !_this.isReapeat
      _this.setConfig('isReapeat', _this.isReapeat)
      repeatBtn.classList.toggle('active', _this.isReapeat)
      
    }
    audio.onended  = function (){
      if(_this.isReapeat){
        audio.play();
      }
      else{
        nextBtn.click();
      }
      
    }
    playList.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)')
      if(songNode|| e.target.closest('.option')){
        if(songNode){
           _this.currentIndex = Number(songNode.dataset.index);
           _this.loadCurrentSong();
           _this.render();
           audio.play();
           
          }
        if(e.target.closest('.option')){
            
          }
      } 
    }
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function(){
    this.isRandom = this.config.isRandom
    this.isReapeat = this.config.isReapeat
  },
  scroolToActiveSong: function () {
    setTimeout(() => {
      document.querySelector('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'

      })
    }, 3000);
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length -1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex
    do{
      newIndex = Math.floor(Math.random()* this.songs.length)
    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
    rdBtn.classList.toggle('active', _this.isRandom)
    repeatBtn.classList.toggle('active', _this.isReapeat)

  },
};

app.start();