"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "./login-form"

export function LoginFormWithSearchParams() {
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered") === "true"

  return <LoginForm registered={registered} />
}

