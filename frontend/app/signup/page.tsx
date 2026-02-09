"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import PhoneInput from "react-phone-number-input"

export default function SignupPage() {
  const router = useRouter();

  const [gender, setGender] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [companyname, setCompanyname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmedPassword, setConfirmedPassword] = useState("")

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault()

    try {
      const res = await fetch(
        "https://wayalink-api.onrender.com/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gender: gender,
            firstname: firstname,
            lastname: lastname,
            idNumber: idNumber,
            phoneNumber: phoneNumber,
            signupEmail: email,
            companyname: companyname,
            signupPassword: password,
            confirmedPassword: confirmedPassword,
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

      <div className="diagonal-lines">
        <div className="diagonal-line diagonal-45"></div>
        <div className="diagonal-line diagonal-neg-45"></div>
        <div className="diagonal-line diagonal-30"></div>
        <div className="diagonal-line diagonal-60"></div>
      </div>

      <div className="dashboard-card">
        <div className="right-sidebar flexed">
          <form onSubmit={handleSignup}>
            <div>
              <input
                id="input-firstname"
                placeholder="First name"
                value={firstname}
                onChange={(event) => { setFirstname(event.target.value) }}
                required
              />
              <input
                id="input-lastname"
                placeholder="Last name"
                value={lastname}
                onChange={(event) => { setLastname(event.target.value) }}
                required
              />
              <input
                id="input-companyname"
                placeholder="Company name"
                value={companyname}
                onChange={(event) => { setCompanyname(event.target.value) }}
                required
              />
              <input
                id="input-id-number"
                placeholder="ID Number"
                value={idNumber}
                onChange={(event) => { setIdNumber(event.target.value) }}
                required
              />
            </div>

            <div>
              <PhoneInput
                international
                defaultCountry="KE"
                id="input-phone-number"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || "")}
                required
              />
              <input
                id="input-signup-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => { setEmail(event.target.value) }}
                required
              />
              <select
                id="select-gender"
                value={gender}
                onChange={(event) => { setGender(event.target.value) }}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <input
                id="input-signup-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => { setPassword(event.target.value) }}
                required
              />
              <input
                id="input-signup-password"
                type="password"
                placeholder="Confirm password"
                value={confirmedPassword}
                onChange={(event) => { setConfirmedPassword(event.target.value) }}
                required
              />
            </div>

            <div>
              <a id="link-policy-agreement" >Agree with privacy policy</a>
              <button id="button-submit-signup" type="submit">Sign up</button>
            </div>
          </form>

          <div>
            <p>Already have an account?</p>
            <a id="link-login" href="/login" >Log in</a>
          </div>
        </div>
      </div>
    </div>
  )
}
