import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members/members.service';
import { PresenceService } from 'src/app/_services/signalr/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input()
  member: Member;

  isUserOnline$: Observable<boolean>;

  constructor(
    private membersService: MembersService,
    private toastr: ToastrService,
    private presenceService: PresenceService
  ) {
    this.isUserOnline$ = this.presenceService.onlineUsers$
      .pipe(
        map(usernames => usernames.includes(this.member.username))
      );
  }

  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.membersService.addLike(member.username).subscribe(() => this.toastr.success("You have liked " + member.knownAs));
  }

}
