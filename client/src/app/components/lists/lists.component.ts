import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  
  members: Partial<Member>[];
  predicate: 'liked' | 'likedBy' = "liked";
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;

  constructor(
    private membersService: MembersService
  ) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.membersService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  onPageChanged(event) {
    this.pageNumber = event.page;
    this.loadLikes();
  }

}
