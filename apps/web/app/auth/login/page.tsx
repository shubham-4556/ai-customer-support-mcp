"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Mail, Lock, AlertCircle, Eye, EyeOff, Loader2, CheckCircle, XCircle, Zap, Shield, Bot, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.4, ease: "easeOut" as const }
  })
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const formRef = useRef<HTMLFormElement>(null);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 12.5;
      if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
      setPasswordStrength(Math.min(strength, 100));
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        break;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        break;
    }
    return "";
  };

  const handleBlur = (field: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (touchedFields[field]) {
      const err = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    if (!isLogin) {
      const nameErr = validateField("name", name);
      if (nameErr) { newErrors.name = nameErr; hasErrors = true; }
    }
    const emailErr = validateField("email", email);
    if (emailErr) { newErrors.email = emailErr; hasErrors = true; }
    const passwordErr = validateField("password", password);
    if (passwordErr) { newErrors.password = passwordErr; hasErrors = true; }
    if (!isLogin) {
      const confirmErr = validateField("confirmPassword", confirmPassword);
      if (confirmErr) { newErrors.confirmPassword = confirmErr; hasErrors = true; }
    }

    setFieldErrors(newErrors);
    setTouchedFields({
      name: !isLogin,
      email: true,
      password: true,
      confirmPassword: !isLogin
    });

    if (hasErrors) {
      setShake(prev => prev + 1);
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setShake(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(prev => !prev);
    setError("");
    setFieldErrors({});
    setTouchedFields({});
    setName("");
    setConfirmPassword("");
  };

  const strengthColor = passwordStrength < 33 ? "bg-red-500" :
    passwordStrength < 66 ? "bg-amber-500" : "bg-emerald-500";
  const strengthLabel = passwordStrength < 33 ? "Weak" :
    passwordStrength < 66 ? "Fair" : "Strong";

  interface InputField {
    name: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    type: string;
    placeholder: string;
    required: boolean;
    showToggle?: boolean;
    showStrength?: boolean;
  }

  const inputFields: InputField[] = isLogin ? [
    { name: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "you@example.com", required: true },
    { name: "password", label: "Password", icon: Lock, type: showPassword ? "text" : "password", placeholder: "••••••••", required: true, showToggle: true }
  ] : [
    { name: "name", label: "Full Name", icon: Mail, type: "text", placeholder: "John Doe", required: true },
    { name: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "you@example.com", required: true },
    { name: "password", label: "Password", icon: Lock, type: showPassword ? "text" : "password", placeholder: "••••••••", required: true, showToggle: true, showStrength: true },
    { name: "confirmPassword", label: "Confirm Password", icon: Lock, type: showPassword ? "text" : "password", placeholder: "••••••••", required: true }
  ];

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#090d16] px-4 py-12 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -left-40 w-[600px] h-[600px] bg-cyan-600/10 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 -right-40 w-[600px] h-[600px] bg-emerald-600/10 blur-[140px] rounded-full" />

      <motion.div
        className="relative w-full max-w-md"
        style={{ transform: `translateX(${shake * 8}px)` }}
        animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative z-10"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 mx-auto mb-4 relative"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-[13px] bg-[#090d16]">
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
                      className="h-7 w-7 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </motion.svg>
                  </div>
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 opacity-30 blur-xl" />
                </motion.div>
                <motion.h1
                  variants={itemVariants}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {isLogin ? "Welcome back" : "Create account"}
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-slate-400 text-sm max-w-xs mx-auto"
                >
                  {isLogin ? "Sign in to access your AI-powered dashboard" : "Start managing customer support with MCP"}
                </motion.p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="flex items-center gap-2 rounded-lg bg-red-950/60 border border-red-500/30 p-3 text-sm text-red-400 mb-6 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
                {inputFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    variants={itemVariants}
                    custom={index}
                  >
                    <label htmlFor={field.name} className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-red-400 text-xs" aria-hidden="true">*</span>}
                    </label>
                    <div className="relative">
                      <field.icon
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-indigo-400"
                        aria-hidden="true"
                      />
                      <input
                        id={field.name}
                        type={field.type}
                        value={
                          field.name === "name" ? name :
                          field.name === "email" ? email :
                          field.name === "password" ? password : confirmPassword
                        }
                        onChange={(e) => handleChange(field.name, e.target.value,
                          field.name === "name" ? setName :
                          field.name === "email" ? setEmail :
                          field.name === "password" ? setPassword : setConfirmPassword)}
                        onBlur={(e) => handleBlur(field.name, e.target.value)}
                        required={field.required}
                        autoComplete={field.name === "name" ? "name" : field.name === "email" ? "email" : field.name === "password" ? "new-password" : "new-password"}
                        className={`
                          w-full pl-12 pr-${field.showToggle ? 12 : 4} py-3 rounded-xl bg-slate-900/90 border transition-all duration-200
                          text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
                          ${touchedFields[field.name] && fieldErrors[field.name] ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-800 hover:border-slate-700"}
                        `}
                        placeholder={field.placeholder}
                        disabled={isLoading}
                        aria-invalid={touchedFields[field.name] && !!fieldErrors[field.name]}
                        aria-describedby={touchedFields[field.name] && fieldErrors[field.name] ? `${field.name}-error` : undefined}
                      />
                      {field.showToggle && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded p-1"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      )}
                      {field.showStrength && password && (
                        <div className="absolute bottom-[-6px] right-4 text-xs font-medium" style={{ color: strengthColor.replace("bg-", "") }}>
                          {strengthLabel}
                        </div>
                      )}
                    </div>
                    {touchedFields[field.name] && fieldErrors[field.name] && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        id={`${field.name}-error`}
                        className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                        role="alert"
                      >
                        <XCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors[field.name]}
                      </motion.p>
                    )}
                    {field.showStrength && password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={passwordStrength}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Password strength"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  variants={itemVariants}
                  custom={inputFields.length}
                  className={`
                    w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm
                    hover:from-indigo-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[#090d16]
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                    flex items-center justify-center gap-2 relative overflow-hidden
                  `}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  aria-busy={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{isLogin ? "Sign in" : "Create account"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 hover:opacity-100 transition-opacity" />
                </motion.button>
              </form>

              <motion.div
                variants={itemVariants}
                custom={inputFields.length + 1}
                className="mt-6 text-center"
              >
                <p className="text-slate-400 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={switchMode}
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors relative"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 transform scale-x-0 hover:scale-x-100 transition-transform origin-left" />
                  </button>
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={inputFields.length + 2}
                className="mt-6 pt-6 border-t border-slate-800 relative"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-4">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo credentials</span>
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                    <p className="text-slate-400 mb-1">Email</p>
                    <code className="text-white font-mono break-all">admin@example.com</code>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                    <p className="text-slate-400 mb-1">Password</p>
                    <code className="text-white font-mono">admin123</code>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#090d16]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </motion.div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}