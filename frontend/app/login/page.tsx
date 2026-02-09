"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react"

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault()

    try {
      const res = await fetch(
        "https://wayalink-api.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loginEmail: email,
            loginPassword: password,
          }),
        }
      )

      // Parse the JSON response from the API
      const data = await res.json().catch(() => (
        { success: false, message: "Failed to parse response" }
      ))
      console.log("API Response:", data)

      // Check if the response is ok AND if the API returned success
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}, message: ${data.message || res.statusText}`)
      }

      if (data.success === true) {
        router.push("/home")
      } else {
        throw new Error(data.message)
      }

    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="dashboard-container">
      {/* Background patterns and gradients */}
      <div className="grid-pattern" aria-hidden />

      {/*<div className="diagonal-lines">
        <div className="diagonal-line diagonal-45"></div>
        <div className="diagonal-line diagonal-neg-45"></div>
        <div className="diagonal-line diagonal-30"></div>
        <div className="diagonal-line diagonal-60"></div>
      </div>*/}

      <div>
        <form onSubmit={handleLogin}>
          <input
            id="input-login-email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => { setEmail(event.target.value) }}
            required
          />
          <input
            id="input-login-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => { setPassword(event.target.value) }}
            required
          />
          <a id="link-forgot-password" href="/forgotPassword" >Forgot password?</a>
          <button id="button-submit-login" type="submit">Login</button>
        </form>

        <div>
          <p>Already have an account?</p>
          <a id="link-signup" href="/signup" >Sign up</a>
        </div>
      </div>
    </div>
  )
}
