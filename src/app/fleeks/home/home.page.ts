import { Component, ElementRef, ChangeDetectorRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MessageService } from 'src/app/messages/message.service';
import { SuperTabs } from '@ionic-super-tabs/angular';
import { SuperTabsConfig } from '@ionic-super-tabs/core';
import { Router } from '@angular/router';
import { VideoService } from '../video.service';
import { Capacitor, Plugins } from '@capacitor/core';

const { CapacitorVideoPlayer } = Plugins;
import * as WebVPPlugin from 'capacitor-video-player';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {



  @ViewChildren('player')videoPlayers: QueryList<any>;

  selectedFile: any;
  videos;
  videoPlayer: any;
  videoPlayer1: any;
  currentlyPlaying = null;
  stickyVideo: HTMLVideoElement = null;

  stickyPlaying = false;
  @ViewChild('stickyplayer', {static: false}) stickyPlayer: ElementRef;

  slideOptions = {
    direction: 'vertical',
  };

  constructor(
    private renderer: Renderer2,
    private routes: Router,
    public msgService: MessageService,
    public videoService: VideoService,
  ) { 
    this.videos = this.msgService.getVidoes();
    
    this.videoService.loadVideos().then(videos => {
      //this.videos = videos
      console.log('this is player list', videos);
      console.log('src vids', this.videos);
      //this.videos = videos;
    });
    

  }

  async ngOnInit() {
    
    // this.videos = await this.videoService.loadVideos();

    // console.log('these are videos', this.videos);
 
    // Initialise the video player plugin
    // if (Capacitor.isNative) {
    //   this.videoPlayer = CapacitorVideoPlayer;
    // } else {
    //   this.videoPlayer = WebVPPlugin.CapacitorVideoPlayer;
    // }

  }


  // async ngAfterViewInit() {
  //   this.videos = await this.videoService.loadVideos();

  //   console.log('these are videos', this.videos);
 
  //   // Initialise the video player plugin
  //   if (Capacitor.isNative) {
  //     this.videoPlayer = CapacitorVideoPlayer;
  //   } else {
  //     this.videoPlayer = WebVPPlugin.CapacitorVideoPlayer;
  //   }
  // }

  async play(url: string) {
    console.log('video url', url);
    document.
    addEventListener('jeepCapVideoPlayerPlay', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPlay ', e.detail) }, false);
    document.
    addEventListener('jeepCapVideoPlayerPause', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPause ', e.detail) }, false);
    document.
    addEventListener('jeepCapVideoPlayerEnded', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerEnded ', e.detail) }, false);
    const res: any = await this.videoPlayer.initPlayer({ mode: 'embedded', url: url, playerId:"fullscreen" });
    console.log('video url', res);
  }

  openFullScreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitEnterFullscreen) {
      elem.webkitEnterFullscreen();
      elem.enterFullscreen();
    }
  }


  didScroll() {
    if (this.currentlyPlaying && this.isElementInViewport(this.currentlyPlaying)) {
      return;
    } else if (this.currentlyPlaying && !this.isElementInViewport(this.currentlyPlaying)) {
      // item is out of view, paused it
      this.currentlyPlaying.pause();
      this.currentlyPlaying = null;
    }

    this.videoPlayers.forEach( player => {
      console.log('this is play', player.nativeElement);

      if (this.currentlyPlaying) {
        return;
      }

      const nativeElement = player.nativeElement;
      const inView = this.isElementInViewport(nativeElement);
      
      if (this.stickyVideo && this.stickyVideo.src == nativeElement.src) {
        return;
      }

      if (inView) {
        this.currentlyPlaying = nativeElement;
        this.currentlyPlaying.muted = true;
        this.currentlyPlaying.play();
        //this.currentlyPlaying.loop();
      }
    });
  }


isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientHeight)
  );
}


playOnSide(elem) {

  if (this.stickyVideo) {
    this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
  }

  this.stickyVideo = elem.cloneNode(true);

  this.renderer.appendChild(this.stickyPlayer.nativeElement, this.stickyVideo);

  if (this.currentlyPlaying) {
    const playPosition = this.currentlyPlaying.currentTime;
    this.currentlyPlaying.pause();
    this.currentlyPlaying = null;
    this.stickyVideo.currentTime = playPosition;
  }

  this.stickyVideo.muted = false;
  this.stickyVideo.play();
  this.stickyPlaying = true;
}

closeSticky() {
  if (this.stickyVideo) {
    this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
    this.stickyVideo = null;
    this.stickyPlaying = false;
  }
}


playOrPauseSticky() {
  if (this.stickyPlaying) {
    this.stickyVideo.pause();
    this.stickyPlaying = false;
  } else {
    this.stickyVideo.play();
    this.stickyPlaying = true;
  }
}


SlideDidChange(item) {
  let realUrl;
  console.log('src vids', this.videos);
  this.videoService.loadVideos().then(async videos => {
    console.log('this is player list', videos[0]);
    
    realUrl = await this.videoService.getVideoUrl(videos[0]);
    // const reader = new FileReader();

    // reader.readAsDataURL(videos[0].target[0]);
    // reader.onload = ((r) => {
    //   this.selectedFile = r.target.result;
    //   console.log('this is slide', this.selectedFile );
    // });


  });
  


  if (this.currentlyPlaying && this.isElementInViewport(this.currentlyPlaying)) {
    return;
  } else if (this.currentlyPlaying && !this.isElementInViewport(this.currentlyPlaying)) {
    // item is out of view, paused it
    this.currentlyPlaying.pause();
    this.currentlyPlaying = null;
  }

  this.videoPlayers.forEach( player => {
    console.log("whats playing", player.nativeElement);

    if (this.currentlyPlaying) {
      return;
    }

    const nativeElement = player.nativeElement;
    const inView = this.isElementInViewport(nativeElement);
    
    if (this.stickyVideo && this.stickyVideo.src == nativeElement.src) {
      return;
    }

    if (inView) {
      this.currentlyPlaying = nativeElement;
      console.log('playing', this.currentlyPlaying);
      this.currentlyPlaying.muted = false;
      this.currentlyPlaying.play();
      //this.currentlyPlaying.loop();
    }
  });

}

  didScrolls(eer) {

  }

  openMarketplace(id) {
    this.routes.navigateByUrl(`/board/discover`);
  }



  async startPlay(video) {
    // Get the video as base64 data
    const realUrl = await this.videoService.getVideoUrl(video);
 
    // Show the player fullscreen
    await this.videoPlayer.initPlayer({
      mode: 'fullscreen',
      url: realUrl,
      playerId: 'fullscreen',
      componentTag: 'app-video'
    });    
  }




}
