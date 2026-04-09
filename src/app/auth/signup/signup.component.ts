import { Component } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "@services/auth.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./signup.component.html",
})
export class SignupComponent {
  signupForm: FormGroup
  error = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      first_name: ["", Validators.required],
      middle_name: [""],
      last_name: ["", Validators.required],
      phone_number: ["", Validators.required],
    })
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => this.router.navigate(["/auth/signin"]),
        error: (err) => (this.error = "Registration failed. Try again."),
      })
    }
  }
}
