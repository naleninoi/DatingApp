import { Component } from "@angular/core";
import { AccountService } from "src/app/_services/account/account.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {

    model: {
        username: string,
        password: string
    } = { username: '', password: '' };

    loggedIn = false;

    constructor(
        private accountService: AccountService
    ) { }

    login() {
        this.accountService.login(this.model).subscribe(
            {
                next: response => {
                    console.log(response);
                    this.loggedIn = true;
                },
                error: error => console.error(error)
            }
        );
    }

}
