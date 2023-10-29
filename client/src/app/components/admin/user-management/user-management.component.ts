import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin/admin.service';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: Partial<User>[] = [];

  bsModalRef: BsModalRef;

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => this.users = users);
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      const rolesToUpdate = [...values.filter(el => el.checked).map(el => el.name)];
      if (rolesToUpdate.length > 0) {
        this.adminService.updateUserRoles(user.username, rolesToUpdate).subscribe((responseRoles) => {
          user.roles = [...responseRoles];
        });
      }
    });
  }

  private getRolesArray(user: User) {
    const roles = [];
    const availableRoles = [
      {name: 'Admin', value: 'Admin', checked: false},
      {name: 'Moderator', value: 'Moderator', checked: false},
      {name: 'Member', value: 'Member', checked: false}
    ];

    availableRoles.forEach(role => {
      role.checked = user.roles.some(userRole => userRole === role.name);
      roles.push(role);
    });
    return roles;
  }

}
