import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [NavComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('BuddyDuel');
  }
}
