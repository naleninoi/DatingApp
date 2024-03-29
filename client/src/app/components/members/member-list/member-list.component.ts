import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/user-params';
import { AccountService } from 'src/app/_services/account/account.service';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members: Member[];
  pagination: Pagination;
  user: User;
  userParams: UserParams;
  genderList = [
    {value: "male", display: "Males"},
    {value: "female", display: "Females"}
  ];

  constructor(
    private membersService: MembersService
  ) {
    this.userParams = this.membersService.userParams;
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.userParams = this.userParams;
    this.membersService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters() {
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }

  onPageChanged(event) {
    this.userParams.pageNumber = event.page;
    this.membersService.userParams = this.userParams;
    this.loadMembers();
  }

}
