import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account/account.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    model: {
        username: string,
        password: string
    } = { username: '', password: '' };

    currentUser$: Observable<User>;

    constructor(
        private accountService: AccountService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser$ = this.accountService.currentUser$;
    }

    login() {
        this.accountService.login(this.model).subscribe(
            {
                next: response => {
                    this.router.navigate(['/members']);
                },
                error: error => console.error(error)
            }
        );
    }

    logout() {
        this.accountService.logout();
        this.router.navigate(['/']);
    }

}
