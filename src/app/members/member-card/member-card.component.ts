import { AlertifyService } from './../../_services/alertify.service';
import { User } from './../../_models/user';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(private userService: UserService, private authService: AuthService, private alertifY: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(recipientId: number) {
  this.userService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe(data => {
      this.alertifY.success('You have liked: ' + this.user.knownAs);
    }, error => {
      this.alertifY.error(error);
    });
  }
}
