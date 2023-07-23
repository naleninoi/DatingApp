import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  
  members: Partial<Member>[];
  predicate: 'liked' | 'likedBy' = "liked";

  constructor(
    private membersService: MembersService
  ) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.membersService.getLikes(this.predicate).subscribe(response => {
      this.members = response;
    });
  }

}
