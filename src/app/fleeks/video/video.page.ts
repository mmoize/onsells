import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
import { VideoService } from '../video.service';
const { CapacitorVideoPlayer } = Plugins;
import * as WebVPPlugin from 'capacitor-video-player';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {
  @ViewChild('video') captureElement: ElementRef;
  mediaRecorder: any;
  videoPlayer: any;
  isRecording = false;
  videos = [];

  constructor(
    public videoService: VideoService,
    private changeDetector: ChangeDetectorRef

  ) { }

  ngOnInit() {
  }


  async ngAfterViewInit() {
    this.videos = await this.videoService.loadVideos();
 
    // Initialise the video player plugin
    if (Capacitor.isNative) {
      this.videoPlayer = CapacitorVideoPlayer;
    } else {
      this.videoPlayer = WebVPPlugin.CapacitorVideoPlayer;
    }
  }
 
  async recordVideo() {
    // Create a stream of video capturing
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user'
      },
      audio: true
    });
 
    // Show the stream inside our video object
    this.captureElement.nativeElement.srcObject = stream;
 
    var options = {mimeType: 'video/webm'};
    this.mediaRecorder = new MediaRecorder(stream, options);
    let chunks = [];
 
    // Store the video on stop
    this.mediaRecorder.onstop = async (event) => {
      const videoBuffer = new Blob(chunks, { type: 'video/webm' });
      await this.videoService.storeVideo(videoBuffer);
      
      // Reload our list
      this.videos = this.videoService.videos;
      this.changeDetector.detectChanges();
    };
 
    // Store chunks of recorded video
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };
 
    // Start recording wth chunks of data
    this.mediaRecorder.start(100);
    this.isRecording = true;
  }
 
  stopRecord() {
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.captureElement.nativeElement.srcObject = null;
    this.isRecording = false;
  }
 
  async play(video) {
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
