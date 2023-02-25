import { Component, OnInit } from '@angular/core';
import { ErrorsService } from 'src/app/_services/errors/errors.service';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {

  validationErrors: string[] = [];

  constructor(
    private errorsService: ErrorsService
  ) { }

  ngOnInit(): void {
  }

  get404Error() {
    this.errorsService.get404Error().subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error(error);
      }
    });
  }

  get400Error() {
    this.errorsService.get400Error().subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error(error);
      }
    });
  }

  get400ValidationError() {
    this.errorsService.get400ValidationError().subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error(error);
        this.validationErrors = error;
      }
    });
  }

  get500Error() {
    this.errorsService.get500Error().subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error(error);
      }
    });
  }

  get401Error() {
    this.errorsService.get401Error().subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error(error);
      }
    });
  }

}
