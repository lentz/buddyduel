import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef, ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.titleService.setTitle('BuddyDuel');
  }
}
