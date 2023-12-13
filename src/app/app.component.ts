import { Component, OnDestroy } from '@angular/core';
import { Subscription, switchMap, timer} from 'rxjs';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  inputUsername: string = '';
  displayUsername: string = '';
  isSubmitting: boolean = false;
  success: boolean = false;
  errorMessage: string = '';
  retryTime: number = 0;
  private timerSubscription: Subscription = new Subscription();

  constructor(private loginService: LoginService) { }

  onSubmit() {
    if (this.isSubmitting || this.retryTime > 0) {
      return;
    }
    this.isSubmitting = true;
    const submittedUsername = this.inputUsername;
    timer(2000).pipe(
      switchMap(() => this.loginService.checkLogin(submittedUsername)),
    ).subscribe((isValid: boolean) => {
      if (isValid) {
        this.success = true;
        this.retryTime = 0;
        this.displayUsername = this.inputUsername;
      } else {
        this.success = false;
        this.errorMessage = 'Неверное имя';
        this.retryTime = 60;
        this.timerSubscription = timer(0, 1000).subscribe(() => {
          if (this.retryTime > 0) {
            this.retryTime--;
          } else {
            this.timerSubscription.unsubscribe();
          }
        });
        timer(5000).subscribe(() => {
          this.errorMessage = '';
        });
      }
      this.isSubmitting = false;
    });
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }
}
