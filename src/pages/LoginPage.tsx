import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gfgLogo from "@/assets/gfg-logo.svg";
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Shield } from "lucide-react";

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDept, setRegDept] = useState("");
  const [regYear, setRegYear] = useState("");
  const [regRegNo, setRegRegNo] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(loginEmail, loginPassword, role);
    if (success) {
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(role === "admin" ? "Access denied. Only authorized club leads can access admin panel." : "Invalid email or password.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (regPassword !== regConfirmPassword) { setError("Passwords do not match."); return; }
    const success = register({ name: regName, email: regEmail, phone: regPhone, department: regDept, year: regYear, registerNumber: regRegNo, role: "member" }, regPassword);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Email already registered.");
    }
  };

  const nextStep = () => {
    if (step === 1 && (!regName || !regEmail || !regPhone)) { setError("Please fill all fields."); return; }
    if (step === 1 && !/\S+@\S+\.\S+/.test(regEmail)) { setError("Invalid email format."); return; }
    if (step === 2 && (!regDept || !regYear || !regRegNo)) { setError("Please fill all fields."); return; }
    setError("");
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass-card p-8 md:p-10 w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <img src={gfgLogo} alt="GeeksforGeeks Logo" className="h-12 mb-4" />
          <h1 className="text-2xl font-bold gradient-text">GFG Campus Club</h1>
          <p className="text-muted-foreground text-sm mt-1">Rajalakshmi Institute of Technology</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-lg bg-muted p-1 mb-6">
          <button onClick={() => { setMode("login"); setError(""); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Login
          </button>
          <button onClick={() => { setMode("register"); setStep(1); setError(""); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Join the Club
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-2 text-sm mb-4">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Toggle */}
            <div className="flex gap-3 mb-2">
              <button type="button" onClick={() => setRole("member")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all duration-200 ${role === "member" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                <User size={16} /> Member
              </button>
              <button type="button" onClick={() => setRole("admin")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all duration-200 ${role === "admin" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                <Shield size={16} /> Admin
              </button>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@email.com" className="input-field" required />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••" className="input-field pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Login <ArrowRight size={16} />
            </button>

            {role === "admin" && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Only authorized club leads can access the admin panel.
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? "bg-primary w-10" : "bg-muted w-6"}`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Step 1: Your Identity</p>
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Full Name" className="input-field" required />
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email Address" className="input-field" required />
                  <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="Phone Number" className="input-field" required />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Step 2: Academics</p>
                  <select value={regDept} onChange={e => setRegDept(e.target.value)} className="input-field" required>
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="MECH">MECH</option>
                    <option value="EEE">EEE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="AIDS">AI & DS</option>
                  </select>
                  <select value={regYear} onChange={e => setRegYear(e.target.value)} className="input-field" required>
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                  <input type="text" value={regRegNo} onChange={e => setRegRegNo(e.target.value)} placeholder="Register Number" className="input-field" required />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Step 3: Secure Your Account</p>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password (min 6 chars)" className="input-field pr-10" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <input type="password" value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} placeholder="Confirm Password" className="input-field" required minLength={6} />
                  {regPassword.length > 0 && regPassword.length < 6 && (
                    <p className="text-xs text-destructive">Password must be at least 6 characters</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Join the Club <ArrowRight size={16} />
                </button>
              )}
            </div>
          </form>
        )}

        {/* Demo credentials */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">Demo: <span className="font-mono text-primary">lead.gfgrit@gmail.com</span> / <span className="font-mono text-primary">admin123</span></p>
          <p className="text-xs text-muted-foreground text-center mt-1">Member: <span className="font-mono text-primary">priya@gfg.com</span> / <span className="font-mono text-primary">member123</span></p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
