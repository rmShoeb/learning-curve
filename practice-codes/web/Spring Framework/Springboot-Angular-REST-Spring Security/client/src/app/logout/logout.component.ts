import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UtilService } from '../util.service'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
    constructor(
        private _router: Router,
        private util: UtilService
    ) {}

    ngOnInit(): void {
        this.util.resetJwt();
    }
}
