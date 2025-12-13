import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import BorderAnimatedContainers from "../components/BorderAnimatedContainers.jsx"

function SignUpPage() {

  const [formData, setFormData] = useState({
    fullName: "",email: "",password: ""});
    const {signup,isSigningUp} = useAuthStore()
    
    const handleSubmit = (e) => {}
    return <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainers>
          <div className="w-full flex flex-col md:flex-row">

          </div>
        </BorderAnimatedContainers>
      </div>
    </div>
  
}

export default SignUpPage
