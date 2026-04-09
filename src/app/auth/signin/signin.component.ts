import { Component } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "@services/auth.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-signin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./signin.component.html",
})
export class SigninComponent {
  signinForm: FormGroup
  error = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signinForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.authService.signin(this.signinForm.value).subscribe({
        next: () => this.router.navigate(["/dashboard"]),
        error: (err) => {
          this.error = "Invalid credentails"
          console.log(this.error)
        },
      })
    }
  }
}
