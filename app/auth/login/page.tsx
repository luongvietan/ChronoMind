import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { LoginFormWithSearchParams } from "@/components/auth/login-form-with-search-params"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<LoginForm registered={false} />}>
        <LoginFormWithSearchParams />
      </Suspense>
    </div>
  )
}

